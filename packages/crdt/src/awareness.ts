import { Awareness } from 'y-protocols/awareness';

export interface RemoteUser {
  clientId: number;
  user?: {
    id?: string;
    name: string;
    color: string;
    avatar?: string;
  };
  cursor?: {
    x: number;
    y: number;
  };
  selection?: string[];
  reaction?: {
    emoji: string;
    timestamp: number;
  };
  laser?: {
    points: number[];
    color: string;
    timestamp: number;
  };
}

export class PresenceManager {
  private awareness: Awareness;

  constructor(awareness: Awareness) {
    this.awareness = awareness;
  }

  setUser(user: { id?: string; name: string; color: string; avatar?: string }): void {
    this.awareness.setLocalStateField('user', user);
  }

  setCursor(cursor: { x: number; y: number } | null): void {
    this.awareness.setLocalStateField('cursor', cursor);
  }

  setSelection(shapeIds: string[]): void {
    this.awareness.setLocalStateField('selection', shapeIds);
  }

  setReaction(reaction: { emoji: string; timestamp: number } | null): void {
    this.awareness.setLocalStateField('reaction', reaction);
  }

  setLaser(laser: { points: number[]; color: string; timestamp: number } | null): void {
    this.awareness.setLocalStateField('laser', laser);
  }

  onPresenceChange(callback: (users: RemoteUser[]) => void): () => void {
    const handler = () => {
      const states = this.awareness.getStates();
      const remoteUsers: RemoteUser[] = Array.from(states.entries())
        .filter(([id]) => id !== this.awareness.doc.clientID)
        .map(([id, state]) => ({
          clientId: id,
          user: state.user,
          cursor: state.cursor,
          selection: state.selection,
          reaction: state.reaction,
          laser: state.laser,
        }));
      callback(remoteUsers);
    };

    this.awareness.on('change', handler);
    // Trigger callback initially
    handler();

    return () => {
      this.awareness.off('change', handler);
    };
  }

  clearPresence(): void {
    this.awareness.setLocalState(null);
  }
}
