import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { Shape } from '@cocanvas/shared';
import { ShapeManager, PresenceManager, createProviders } from '@cocanvas/crdt';

interface UseCanvasSyncProps {
  doc: Y.Doc;
  wsUrl: string;
  boardId: string;
  userId: string;
  userName: string;
  userImage: string | null;
  shapeManagerRef: React.RefObject<ShapeManager | null>;
  presenceManagerRef: React.RefObject<PresenceManager | null>;
}

export default function useCanvasSync({
  doc,
  wsUrl,
  boardId,
  userId,
  userName,
  userImage,
  shapeManagerRef,
  presenceManagerRef,
}: UseCanvasSyncProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const localOrigin = Symbol('local');
    const sm = new ShapeManager(doc, localOrigin);
    shapeManagerRef.current = sm;
    setShapes(sm.getShapes());
    
    const onSync = () => {
      setShapes(sm.getShapes());
    };
    sm.observe(onSync);

    const { wsProvider, awareness } = createProviders(doc, {
      wsUrl,
      roomId: boardId,
      token: userId,
    });

    const handleStatus = (event: { status: string }) => {
      setIsConnected(event.status === 'connected');
    };

    if (wsProvider) {
      setIsConnected(wsProvider.wsconnected);
      wsProvider.on('status', handleStatus);
    }

    let unsubscribePresence: (() => void) | null = null;

    if (awareness) {
      const pm = new PresenceManager(awareness);
      presenceManagerRef.current = pm;
      pm.setUser({
        id: userId,
        name: userName,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
        avatar: userImage || undefined,
      });
      unsubscribePresence = pm.onPresenceChange(setCollaborators);
    }

    return () => {
      sm.unobserve(onSync);
      unsubscribePresence?.();
      if (wsProvider) {
        wsProvider.off('status', handleStatus);
        wsProvider.destroy();
      }
    };
  }, [boardId, doc, userId, userName, userImage, wsUrl, shapeManagerRef, presenceManagerRef]);

  return {
    shapes,
    collaborators,
    isConnected,
  };
}
