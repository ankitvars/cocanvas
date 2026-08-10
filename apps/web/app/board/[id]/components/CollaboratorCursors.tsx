import React from 'react';
import { Layer, Circle, Text as KonvaText } from 'react-konva';

interface Collaborator {
  clientId: number;
  cursor?: { x: number; y: number } | null;
  user?: { name: string; color: string } | null;
}

interface CollaboratorCursorsProps {
  collaborators: Collaborator[];
}

export default function CollaboratorCursors({ collaborators }: CollaboratorCursorsProps) {
  return (
    <Layer listening={false}>
      {collaborators.map(c => {
        if (!c.cursor) return null;
        return (
          <React.Fragment key={c.clientId}>
            <Circle 
              x={c.cursor.x} 
              y={c.cursor.y} 
              radius={5}
              fill={c.user?.color || '#6366f1'} 
              perfectDrawEnabled={false} 
            />
            <KonvaText 
              x={c.cursor.x + 8} 
              y={c.cursor.y - 8}
              text={c.user?.name || 'Collaborator'} 
              fontSize={11}
              fill={c.user?.color || '#fff'} 
              perfectDrawEnabled={false} 
            />
          </React.Fragment>
        );
      })}
    </Layer>
  );
}
