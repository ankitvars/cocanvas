import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';

export interface ProviderOptions {
  wsUrl: string;
  roomId: string;
  token?: string;
}

export function createProviders(doc: Y.Doc, options: ProviderOptions) {
  if (typeof window === 'undefined') {
    return { idbProvider: null, wsProvider: null, awareness: null };
  }

  const { wsUrl, roomId, token } = options;

  // 1. Offline-first: Load from IndexedDB instantly
  const idbProvider = new IndexeddbPersistence(`cocanvas-${roomId}`, doc);

  // 2. Online sync: Connect to WebSocket server
  const params: Record<string, string> = {};
  if (token) {
    params.token = token;
  }

  const wsProvider = new WebsocketProvider(wsUrl, roomId, doc, {
    connect: true,
    params,
    resyncInterval: 5000, // Re-sync every 5s for consistency
  });

  return {
    idbProvider,
    wsProvider,
    awareness: wsProvider.awareness,
  };
}
