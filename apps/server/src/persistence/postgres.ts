import * as Y from 'yjs';
// @ts-expect-error y-websocket has no type definitions for bin/utils
import { setPersistence } from 'y-websocket/bin/utils';
import { db } from '../db/index.js';
import { yjsDocuments, yjsUpdates } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { logger } from '../observability/logger.js';
import { redis } from '../cache/redis.js';

// Map to keep track of active Redis pub/sub subscriptions per room
const redisSubscriptions = new Map<string, any>();

export function setupPersistence() {
  setPersistence({
    bindState: async (roomName: string, ydoc: Y.Doc) => {
      try {
        logger.info({ roomName }, 'Binding Yjs state from Postgres...');

        // 1. Fetch consolidated state snapshot from DB
        const documentList = await db
          .select()
          .from(yjsDocuments)
          .where(eq(yjsDocuments.boardId, roomName))
          .limit(1);
        
        const docRecord = documentList[0];

        if (docRecord && docRecord.state) {
          const docStateBuffer = Buffer.from(docRecord.state);
          Y.applyUpdate(ydoc, new Uint8Array(docStateBuffer), 'db-load');
          logger.info({ roomName }, 'Applied consolidated state snapshot from DB');
        }

        // 2. Fetch and apply all incremental updates written since consolidated record
        const updatesList = await db
          .select()
          .from(yjsUpdates)
          .where(eq(yjsUpdates.boardId, roomName))
          .orderBy(yjsUpdates.createdAt);

        if (updatesList.length > 0) {
          updatesList.forEach((updateRecord) => {
            const updateBuffer = Buffer.from(updateRecord.updateData);
            Y.applyUpdate(ydoc, new Uint8Array(updateBuffer), 'db-load');
          });
          logger.info({ roomName, count: updatesList.length }, 'Applied incremental updates from DB');
        }

        // 3. Register local update handler
        // When local clients send changes, write to DB & publish to Redis
        ydoc.on('update', async (update: Uint8Array, origin: any) => {
          // Ignore updates triggered during DB loading or arriving from Redis pub/sub
          if (origin !== 'db-load' && origin !== 'redis-sync') {
            try {
              const updateBuffer = Buffer.from(update.buffer, update.byteOffset, update.byteLength);
              
              // A. Save incremental update to database
              await db.insert(yjsUpdates).values({
                boardId: roomName,
                updateData: updateBuffer,
              });

              // B. Publish update to Redis pub/sub channel for other cluster nodes
              if (redis.isReady) {
                await redis.publish(`yjs:room:${roomName}`, updateBuffer.toString('base64'));
              }
            } catch (err) {
              logger.error({ roomName, err }, 'Failed to save/publish incremental update');
            }
          }
        });

        // 4. Redis Pub/Sub subscription for horizontal scaling
        // If we are scaled, multiple WS server instances subscribe to Redis to relay updates
        if (redis.isReady && !redisSubscriptions.has(roomName)) {
          const duplicateClient = redis.duplicate();
          await duplicateClient.connect();

          await duplicateClient.subscribe(`yjs:room:${roomName}`, (message) => {
            try {
              const updateBuffer = Buffer.from(message, 'base64');
              // Apply update to local document with redis-sync origin to prevent loop
              Y.applyUpdate(ydoc, new Uint8Array(updateBuffer), 'redis-sync');
            } catch (err) {
              logger.error({ roomName, err }, 'Error applying update from Redis pub/sub');
            }
          });

          redisSubscriptions.set(roomName, duplicateClient);
          logger.info({ roomName }, 'Subscribed to Redis pub/sub channel for room');
        }

        logger.info({ roomName }, 'Yjs state successfully bound and synchronized');
      } catch (error) {
        logger.error({ roomName, error }, 'Failed to bind Yjs state from Postgres');
        throw error;
      }
    },
    writeState: async (roomName: string, ydoc: Y.Doc) => {
      try {
        logger.info({ roomName }, 'Consolidating and writing Yjs state snapshot...');
        
        // 1. Encode full document state
        const stateUpdate = Y.encodeStateAsUpdate(ydoc);
        const stateVector = Y.encodeStateVector(ydoc);

        const stateBuffer = Buffer.from(stateUpdate.buffer, stateUpdate.byteOffset, stateUpdate.byteLength);
        const vectorBuffer = Buffer.from(stateVector.buffer, stateVector.byteOffset, stateVector.byteLength);

        // 2. Upsert consolidated snapshot into yjs_documents
        await db
          .insert(yjsDocuments)
          .values({
            boardId: roomName,
            state: stateBuffer,
            stateVector: vectorBuffer,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: yjsDocuments.boardId,
            set: {
              state: stateBuffer,
              stateVector: vectorBuffer,
              updatedAt: new Date(),
            },
          });

        // 3. Clear the incremental updates
        await db.delete(yjsUpdates).where(eq(yjsUpdates.boardId, roomName));

        // 4. Unsubscribe from Redis pub/sub when document is evicted/written (room cleanup)
        const duplicateClient = redisSubscriptions.get(roomName);
        if (duplicateClient) {
          await duplicateClient.unsubscribe(`yjs:room:${roomName}`);
          await duplicateClient.quit();
          redisSubscriptions.delete(roomName);
          logger.info({ roomName }, 'Unsubscribed and closed Redis pub/sub client for room');
        }

        logger.info({ roomName }, 'Successfully consolidated Yjs state in database');
        return true;
      } catch (error) {
        logger.error({ roomName, error }, 'Failed to consolidate and write Yjs state');
        return false;
      }
    },
  });
}
