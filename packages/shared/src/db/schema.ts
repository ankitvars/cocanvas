import { pgTable, uuid, varchar, boolean, timestamp, primaryKey, customType, doublePrecision, text } from 'drizzle-orm/pg-core';

// Custom type for PostgreSQL BYTEA column
const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea';
  },
  toDriver(val: Buffer): Buffer {
    return val;
  },
  fromDriver(val: unknown): Buffer {
    if (Buffer.isBuffer(val)) {
      return val;
    }
    if (typeof val === 'string') {
      return Buffer.from(val, 'hex');
    }
    throw new Error('Expected Buffer from database');
  },
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 2048 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const boards = pgTable('boards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  inviteToken: varchar('invite_token', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const boardMembers = pgTable('board_members', {
  boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 20 }).default('editor').notNull(), // 'viewer' | 'editor' | 'admin'
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.boardId, table.userId] }),
  };
});

export const yjsDocuments = pgTable('yjs_documents', {
  boardId: uuid('board_id').primaryKey().references(() => boards.id, { onDelete: 'cascade' }).notNull(),
  state: bytea('state').notNull(),              // Compacted Y.encodeStateAsUpdate()
  stateVector: bytea('state_vector'),           // Y.encodeStateVector()
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const yjsUpdates = pgTable('yjs_updates', {
  id: uuid('id').primaryKey().defaultRandom(),
  boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }).notNull(),
  updateData: bytea('update_data').notNull(),   // Incremental update
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const boardComments = pgTable('board_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  x: doublePrecision('x').notNull(),
  y: doublePrecision('y').notNull(),
  content: text('content').notNull(),
  resolved: boolean('resolved').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
