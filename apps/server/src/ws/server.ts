import { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
// @ts-expect-error y-websocket has no type definitions for bin/utils
import { setupWSConnection } from 'y-websocket/bin/utils';
import { URL } from 'url';

import { db } from '../db/index.js';
import { boards, boardMembers } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { logger } from '../observability/logger.js';

export function setupWebSocketServer(wss: WebSocketServer) {
  wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    try {
      const requestUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
      
      // Board ID is the path (e.g. /board-uuid)
      const boardId = requestUrl.pathname.slice(1);
      const userId = requestUrl.searchParams.get('token');

      logger.info({ boardId, userId }, 'New WebSocket connection request');

      if (!boardId) {
        ws.close(4000, 'Board ID is required');
        return;
      }

      // 1. Fetch Board Metadata
      const boardList = await db.select().from(boards).where(eq(boards.id, boardId)).limit(1);
      const board = boardList[0];

      if (!board) {
        ws.close(4004, 'Board not found');
        return;
      }

      // 2. Enforce Authentication if board is Private
      if (!board.isPublic) {
        if (!userId) {
          ws.close(4001, 'Unauthorized: token is required');
          return;
        }

        // Check ownership
        if (board.ownerId !== userId) {
          // Check board members role
          const membership = await db
            .select()
            .from(boardMembers)
            .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId)))
            .limit(1);

          if (membership.length === 0) {
            ws.close(4003, 'Forbidden: you are not a member of this board');
            return;
          }
        }
      }

      // 3. Delegate connection to Yjs sync protocol
      // setupWSConnection handles binary sync step exchange and awareness multiplexing
      setupWSConnection(ws, req, {
        docName: boardId,
        gc: true,
      });

      logger.info({ boardId, userId }, 'WebSocket authenticated and connected to room');
    } catch (err: any) {
      logger.error('Error in WebSocket connection handshake:', err);
      ws.close(5000, 'Internal Server Error');
    }
  });
}
