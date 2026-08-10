'use client';

import dynamic from 'next/dynamic';

const WhiteboardClient = dynamic(() => import('./WhiteboardClient'), {
  ssr: false,
});

export interface BoardMember {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
}

interface WhiteboardWrapperProps {
  board: {
    id: string;
    name: string;
    isPublic: boolean;
    ownerId: string;
    inviteToken: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string | null;
    image: string | null;
    role: 'viewer' | 'editor' | 'admin';
  };
  members: BoardMember[];
  wsUrl: string;
}

export default function WhiteboardWrapper({ board, user, members, wsUrl }: WhiteboardWrapperProps) {
  return <WhiteboardClient board={board} user={user} members={members} wsUrl={wsUrl} />;
}
