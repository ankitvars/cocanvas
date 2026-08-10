'use client';

import { useState, useCallback, useEffect } from 'react';
import { Shape, ShapeType } from '@cocanvas/shared';
import { ShapeManager, PresenceManager } from '@cocanvas/crdt';

interface UseWhiteboardEventsProps {
  tool: ShapeType | 'select' | 'eraser' | 'image' | 'comment' | 'laser' | 'bucket' | 'lasso' | 'draw_to_shape';
  setTool: (tool: ShapeType | 'select' | 'eraser' | 'image' | 'comment' | 'laser' | 'bucket' | 'lasso' | 'draw_to_shape') => void;
  scale: number;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  color: string;
  bgType: 'grid' | 'dots' | 'plain';
  setBgType: React.Dispatch<React.SetStateAction<'grid' | 'dots' | 'plain'>>;
  shapes: Shape[];
  selectedShapeId: string | null;
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
  presenceManagerRef: React.RefObject<PresenceManager | null>;
  shapeManagerRef: React.RefObject<ShapeManager | null>;
  stageRef: React.RefObject<any>;
  eraserWidth: number;
  isSpacePressed: boolean;
  isPanning: boolean;
  laserTrails: Record<string, { points: number[]; color: string; timestamp: number }>;
  setLaserTrails: React.Dispatch<React.SetStateAction<Record<string, { points: number[]; color: string; timestamp: number }>>>;
  setNewCommentPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  handleDrawingMouseDown: (e: any) => void;
  handleDrawingMouseMove: (e: any) => void;
  handleDrawingMouseUp: () => void;
  handleShapeDragMove: (id: string, e: any) => void;
  handleShapeTransformEnd: (id: string, e: any) => void;
  handleShapeDblClick: (shape: Shape) => void;
  handleShapePointerDown: (id: string) => void;
  handleShapePointerEnter: (id: string, e: any) => void;
}

export function useWhiteboardEvents({
  tool,
  setTool,
  scale,
  position,
  setPosition,
  color,
  bgType,
  setBgType,
  shapes,
  selectedShapeId,
  setSelectedShapeId,
  presenceManagerRef,
  shapeManagerRef,
  stageRef,
  eraserWidth,
  isSpacePressed,
  isPanning,
  laserTrails,
  setLaserTrails,
  setNewCommentPos,
  handleDrawingMouseDown,
  handleDrawingMouseMove,
  handleDrawingMouseUp,
  handleShapeDragMove,
  handleShapeTransformEnd,
  handleShapeDblClick,
  handleShapePointerDown,
  handleShapePointerEnter,
}: UseWhiteboardEventsProps) {
  const [lassoPoints, setLassoPoints] = useState<number[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean; shapeId: string } | null>(null);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const isPointInPolygon = useCallback((x: number, y: number, polygon: number[]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 2; i < polygon.length; i += 2) {
      const xi = polygon[i], yi = polygon[i + 1];
      const xj = polygon[j], yj = polygon[j + 1];
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0001) + xi);
      if (intersect) inside = !inside;
      j = i;
    }
    return inside;
  }, []);

  const handleMouseDown = (e: any) => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const cx = (pointer.x - position.x) / scale;
    const cy = (pointer.y - position.y) / scale;

    if (tool === 'comment') {
      setNewCommentPos({ x: cx, y: cy });
      return;
    }

    if (tool === 'laser') {
      const trail = { points: [cx, cy], color: '#ef4444', timestamp: Date.now() };
      setLaserTrails((prev) => ({ ...prev, local: trail }));
      presenceManagerRef.current?.setLaser(trail);
      return;
    }

    if (tool === 'lasso') {
      setLassoPoints([cx, cy]);
      return;
    }

    if (tool === 'bucket') {
      const shapeId = e.target.attrs.id || null;
      if (shapeId) {
        const shape = shapes.find((s) => s.id === shapeId);
        if (shape && !shape.locked) {
          shapeManagerRef.current?.updateShape(shapeId, {
            stroke: color,
            fill:
              shape.type !== 'freehand' &&
              shape.type !== 'line' &&
              shape.type !== 'arrow' &&
              shape.type !== 'text'
                ? color
                : 'transparent',
          });
        }
      } else {
        setBgType((prev) => (prev === 'grid' ? 'dots' : prev === 'dots' ? 'plain' : 'grid'));
      }
      return;
    }

    handleDrawingMouseDown(e);
  };

  const handleMouseMove = (e: any) => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const cx = (pointer.x - position.x) / scale;
    const cy = (pointer.y - position.y) / scale;

    if (tool === 'laser' && e.evt.buttons === 1) {
      setLaserTrails((prev) => {
        const currentPoints = prev['local']?.points || [];
        const newPoints = [...currentPoints, cx, cy].slice(-60);
        const trail = { points: newPoints, color: '#ef4444', timestamp: Date.now() };
        presenceManagerRef.current?.setLaser(trail);
        return { ...prev, local: trail };
      });
      return;
    }

    if (tool === 'lasso' && e.evt.buttons === 1) {
      setLassoPoints((prev) => [...prev, cx, cy]);
      return;
    }

    handleDrawingMouseMove(e);
  };

  const handleMouseUp = () => {
    if (tool === 'laser') {
      setLaserTrails((prev) => {
        const next = { ...prev };
        delete next['local'];
        return next;
      });
      presenceManagerRef.current?.setLaser(null);
      return;
    }

    if (tool === 'lasso') {
      if (lassoPoints.length > 4) {
        let foundId: string | null = null;
        const sortedShapes = [...shapes].sort((a, b) => b.zIndex - a.zIndex);
        for (const shape of sortedShapes) {
          if (shape.locked) continue;
          const cx = shape.x + (shape.width || 0) / 2;
          const cy = shape.y + (shape.height || 0) / 2;
          if (isPointInPolygon(cx, cy, lassoPoints)) {
            foundId = shape.id;
            break;
          }
        }
        if (foundId) {
          setSelectedShapeId(foundId);
          presenceManagerRef.current?.setSelection([foundId]);
        }
      }
      setLassoPoints([]);
      return;
    }

    if (tool === 'select' && selectedShapeId) {
      const shape = shapes.find((s) => s.id === selectedShapeId);
      if (shape && shape.type !== 'frame') {
        const sh = shape as any;
        const cx = sh.x + (sh.width || 0) / 2;
        const cy = sh.y + (sh.height || 0) / 2;

        let targetFrameId: string | null = null;
        shapes.forEach((s) => {
          if (s.type === 'frame') {
            const frame = s as any;
            const inFrame =
              cx >= frame.x &&
              cx <= frame.x + frame.width &&
              cy >= frame.y &&
              cy <= frame.y + frame.height;
            if (inFrame) {
              targetFrameId = frame.id;
            }
          }
        });
        if (sh.frameId !== targetFrameId) {
          shapeManagerRef.current?.updateShape(selectedShapeId, { frameId: targetFrameId } as any);
        }
      }
    }

    handleDrawingMouseUp();
  };

  const shapeProps = useCallback(
    (shape: Shape) => ({
      id: shape.id,
      opacity: shape.opacity,
      draggable: tool === 'select' && !shape.locked,
      onDragMove: (e: any) => handleShapeDragMove(shape.id, e),
      onTransformEnd: (e: any) => handleShapeTransformEnd(shape.id, e),
      onDblClick: () => !shape.locked && handleShapeDblClick(shape),
      onPointerDown: () => handleShapePointerDown(shape.id),
      onPointerEnter: (e: any) => handleShapePointerEnter(shape.id, e),
      onContextMenu: (e: any) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;
        setSelectedShapeId(shape.id);
        const container = stage.container();
        const rect = container.getBoundingClientRect();
        setContextMenu({
          x: rect.left + stage.getPointerPosition().x,
          y: rect.top + stage.getPointerPosition().y,
          visible: true,
          shapeId: shape.id,
        });
      },
      strokeScaleEnabled: false,
      perfectDrawEnabled: false,
      listening:
        tool === 'select' ||
        tool === 'eraser' ||
        tool === 'bucket' ||
        tool === 'lasso',
    }),
    [tool, handleShapeDragMove, handleShapeTransformEnd, handleShapeDblClick, handleShapePointerDown, handleShapePointerEnter, stageRef, setSelectedShapeId]
  );

  const getCursorStyle = (): string => {
    if (isSpacePressed) {
      return isPanning ? 'grabbing' : 'grab';
    }
    if (tool === 'select') return 'default';
    if (tool === 'eraser') {
      const size = Math.max(Math.round(eraserWidth * scale), 8);
      const cappedSize = Math.min(size, 128);
      const r = cappedSize / 2;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cappedSize}" height="${cappedSize}" viewBox="0 0 ${cappedSize} ${cappedSize}"><circle cx="${r}" cy="${r}" r="${r - 1.5}" fill="none" stroke="%23ef4444" stroke-width="1.5"/></svg>`;
      return `url('data:image/svg+xml;utf8,${svg}') ${r} ${r}, auto`;
    }
    if (tool === 'freehand') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;
      return `url('data:image/svg+xml;utf8,${svg}') 3 20, crosshair`;
    }
    if (tool === 'text') return 'text';
    if (
      [
        'rectangle',
        'square',
        'rounded_rect',
        'ellipse',
        'circle',
        'triangle',
        'diamond',
        'line',
        'arrow',
      ].includes(tool)
    ) {
      return 'crosshair';
    }
    return 'default';
  };

  return {
    lassoPoints,
    setLassoPoints,
    contextMenu,
    setContextMenu,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    shapeProps,
    getCursorStyle,
  };
}
