'use client';

import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Transformer, Line as KonvaLine } from 'react-konva';
import { Shape } from '@cocanvas/shared';
import RenderShape from './RenderShape';
import CollaboratorCursors from './CollaboratorCursors';

interface WhiteboardCanvasProps {
  stageRef: React.RefObject<any>;
  bgType: 'grid' | 'dots' | 'plain';
  scale: number;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: (e: any) => void;
  getCursorStyle: () => string;
  shapes: Shape[];
  selectedShapeId: string | null;
  liveShape: Shape | null;
  lassoPoints: number[];
  laserTrails: Record<string, { points: number[]; color: string; timestamp: number }>;
  collaborators: any[];
  shapeProps: (shape: Shape) => any;
}

export function WhiteboardCanvas({
  stageRef,
  bgType,
  scale,
  position,
  dimensions,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  getCursorStyle,
  shapes,
  selectedShapeId,
  liveShape,
  lassoPoints,
  laserTrails,
  collaborators,
  shapeProps,
}: WhiteboardCanvasProps) {
  const trRef = useRef<any>(null);
  useEffect(() => {
    if (selectedShapeId) {
      const stage = stageRef.current;
      if (stage) {
        const selectedNode = stage.findOne(`#${selectedShapeId}`);
        if (selectedNode && trRef.current) {
          trRef.current.nodes([selectedNode]);
          trRef.current.getLayer().batchDraw();
        }
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedShapeId, shapes]);
  return (
    <div
      style={{
        ...styles.canvasContainer,
        backgroundImage:
          bgType === 'grid'
            ? 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)'
            : bgType === 'dots'
            ? 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)'
            : 'none',
        backgroundSize:
          bgType === 'grid'
            ? `${40 * scale}px ${40 * scale}px`
            : bgType === 'dots'
            ? `${40 * scale}px ${40 * scale}px`
            : 'none',
        backgroundPosition: `${position.x}px ${position.y}px`,
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: getCursorStyle() }}
      >
        <Layer>
          {shapes.map((s) => (
            <RenderShape key={s.id} shape={s} base={shapeProps(s)} />
          ))}
          {selectedShapeId &&
            (() => {
              const selectedShape = shapes.find((s) => s.id === selectedShapeId);
              if (
                selectedShape &&
                !selectedShape.locked &&
                [
                  'rectangle',
                  'square',
                  'rounded_rect',
                  'ellipse',
                  'circle',
                  'triangle',
                  'diamond',
                  'text',
                  'image',
                ].includes(selectedShape.type)
              ) {
                return (
                  <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                    anchorFill="#6366f1"
                    anchorStroke="#ffffff"
                    anchorStrokeWidth={2}
                    anchorSize={8}
                    borderStroke="#6366f1"
                    borderStrokeWidth={1.5}
                  />
                );
              }
              return null;
            })()}
        </Layer>

        <Layer>
          {liveShape && (
            <RenderShape
              shape={liveShape}
              isLive={true}
              base={{
                id: 'live',
                opacity: liveShape.opacity,
                strokeScaleEnabled: false,
                perfectDrawEnabled: false,
                listening: false,
              }}
            />
          )}

          {/* Lasso Selector Path */}
          {lassoPoints.length > 2 && (
            <KonvaLine
              points={lassoPoints}
              stroke="#6366f1"
              strokeWidth={1.5}
              dash={[4, 4]}
              closed={true}
              fill="rgba(99, 102, 241, 0.08)"
            />
          )}

          {/* Laser Pointer Trails */}
          {Object.entries(laserTrails).map(([id, trail]) => (
            <KonvaLine
              key={id}
              points={trail.points}
              stroke={trail.color || '#ef4444'}
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
              shadowColor={trail.color || '#ef4444'}
              shadowBlur={8}
              opacity={0.8}
            />
          ))}
        </Layer>

        <CollaboratorCursors collaborators={collaborators} />
      </Stage>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  canvasContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
};
