export interface Board {
  id: string;
  name: string;
  ownerId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BoardMemberRole = 'viewer' | 'editor' | 'admin';

export interface BoardMember {
  boardId: string;
  userId: string;
  role: BoardMemberRole;
  joinedAt: Date;
}
