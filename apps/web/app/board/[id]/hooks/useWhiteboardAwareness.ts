'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PresenceManager } from '@cocanvas/crdt';

// Throttle helper
function throttle<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let last = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  }) as T;
}

interface UseWhiteboardAwarenessProps {
  collaborators: any[];
  presenceManagerRef: React.RefObject<PresenceManager | null>;
  stageRef: React.RefObject<any>;
  position: { x: number; y: number };
  scale: number;
}

export function useWhiteboardAwareness({
  collaborators,
  presenceManagerRef,
  stageRef,
  position,
  scale,
}: UseWhiteboardAwarenessProps) {
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; x: number; y: number; createdAt: number }[]>([]);
  const [laserTrails, setLaserTrails] = useState<Record<string, { points: number[]; color: string; timestamp: number }>>({});
  const [mouseScreenPos, setMouseScreenPos] = useState({ x: 0, y: 0 });

  // Throttled cursor broadcast (max 20 fps)
  const broadcastCursor = useRef(
    throttle((x: number, y: number) => {
      presenceManagerRef.current?.setCursor({ x, y });
    }, 50)
  ).current;

  // Mouse screen tracking for emoji picker position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseScreenPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Laser Pointer Decay Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setLaserTrails((prev) => {
        const next: Record<string, any> = {};
        let updated = false;
        Object.entries(prev).forEach(([id, trail]) => {
          if (trail && trail.points.length > 0) {
            const newPoints = trail.points.slice(2);
            if (newPoints.length > 0) {
              next[id] = { ...trail, points: newPoints };
              updated = true;
            }
          }
        });
        return updated ? next : prev;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Sync peer laser pointer trails from collaborators
  useEffect(() => {
    collaborators.forEach((c) => {
      if (c.laser) {
        setLaserTrails((prev) => ({
          ...prev,
          [c.clientId.toString()]: c.laser!,
        }));
      } else {
        setLaserTrails((prev) => {
          if (prev[c.clientId.toString()]) {
            const next = { ...prev };
            delete next[c.clientId.toString()];
            return next;
          }
          return prev;
        });
      }
    });
  }, [collaborators]);

  // Clean up floating reactions periodically
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setFloatingReactions((prev) => prev.filter((r) => now - r.createdAt < 1500));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Listen to remote reactions
  const lastReactionsRef = useRef<Record<number, number>>({});
  useEffect(() => {
    collaborators.forEach((c) => {
      if (c.reaction && c.cursor) {
        const lastTime = lastReactionsRef.current[c.clientId] || 0;
        if (c.reaction.timestamp > lastTime) {
          lastReactionsRef.current[c.clientId] = c.reaction.timestamp;
          const id = `${c.clientId}-${c.reaction.timestamp}-${Math.random()}`;
          setFloatingReactions((prev) => [
            ...prev,
            { id, emoji: c.reaction!.emoji, x: c.cursor!.x, y: c.cursor!.y, createdAt: Date.now() },
          ]);
        }
      }
    });
  }, [collaborators]);

  // Trigger self reaction
  const triggerReaction = useCallback((emoji: string) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const cx = (pointer.x - position.x) / scale;
    const cy = (pointer.y - position.y) / scale;

    const id = `self-${Date.now()}-${Math.random()}`;
    const timestamp = Date.now();

    setFloatingReactions((prev) => [
      ...prev,
      { id, emoji, x: cx, y: cy, createdAt: timestamp },
    ]);

    presenceManagerRef.current?.setReaction({ emoji, timestamp });
  }, [position, scale, stageRef, presenceManagerRef]);

  return {
    floatingReactions,
    setFloatingReactions,
    laserTrails,
    setLaserTrails,
    mouseScreenPos,
    broadcastCursor,
    triggerReaction,
  };
}
