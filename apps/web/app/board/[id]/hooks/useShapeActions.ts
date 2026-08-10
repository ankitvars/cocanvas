import { useCallback } from 'react';
import { Shape } from '@cocanvas/shared';
import { ShapeManager } from '@cocanvas/crdt';

interface UseShapeActionsProps {
  tool: string;
  scale: number;
  position: { x: number; y: number };
  shapeManagerRef: React.RefObject<ShapeManager | null>;
  editingTextId: string | null;
  setEditingTextId: (id: string | null) => void;
  editingTextValue: string;
  setEditingTextValue: (v: string) => void;
  setEditingTextPos: (pos: { x: number; y: number }) => void;
  shapes: any[];
}

export default function useShapeActions({
  tool,
  scale,
  position,
  shapeManagerRef,
  editingTextId,
  setEditingTextId,
  editingTextValue,
  setEditingTextValue,
  setEditingTextPos,
  shapes,
}: UseShapeActionsProps) {

  const handleShapeDragMove = useCallback((shapeId: string, e: any) => {
    if (tool !== 'select') return;
    const shape = shapes.find(s => s.id === shapeId);
    if (!shape) return;
    
    const dx = e.target.x() - shape.x;
    const dy = e.target.y() - shape.y;

    shapeManagerRef.current?.updateShape(shapeId, { x: e.target.x(), y: e.target.y() });

    if (shape.type === 'frame' && (dx !== 0 || dy !== 0)) {
      shapes.forEach(s => {
        if (s.frameId === shapeId) {
          shapeManagerRef.current?.updateShape(s.id, {
            x: s.x + dx,
            y: s.y + dy
          });
        }
      });
    }
  }, [tool, shapeManagerRef, shapes]);

  const handleShapeTransformEnd = useCallback((shapeId: string, e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset node scale to 1 so Konva draws it with absolute width/height
    node.scaleX(1);
    node.scaleY(1);
    
    const shape = shapes.find(s => s.id === shapeId);
    if (!shape) return;
    
    const newWidth = Math.round(shape.width * scaleX);
    const newHeight = Math.round(shape.height * scaleY);
    const newX = Math.round(node.x());
    const newY = Math.round(node.y());
    const newRotation = Math.round(node.rotation());
    
    const updates: any = {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      rotation: newRotation,
    };

    if (shape.type === 'text') {
      const currentFontSize = (shape as any).fontSize || 16;
      updates.fontSize = Math.round(currentFontSize * scaleX);
    }

    shapeManagerRef.current?.updateShape(shapeId, updates);
  }, [shapes, shapeManagerRef]);

  const handleShapeDblClick = useCallback((shape: Shape) => {
    if (shape.type === 'text') {
      const screenX = shape.x * scale + position.x;
      const screenY = shape.y * scale + position.y;
      setEditingTextId(shape.id);
      setEditingTextValue((shape as any).text);
      setEditingTextPos({ x: screenX, y: screenY });
    }
  }, [scale, position, setEditingTextId, setEditingTextValue, setEditingTextPos]);

  const handleFinishTextEdit = useCallback(() => {
    if (editingTextId && shapeManagerRef.current) {
      if (editingTextValue.trim() === '') {
        shapeManagerRef.current.deleteShape(editingTextId);
      } else {
        shapeManagerRef.current.updateShape(editingTextId, { text: editingTextValue } as any);
      }
    }
    setEditingTextId(null);
  }, [editingTextId, editingTextValue, shapeManagerRef, setEditingTextId]);

  const handleShapePointerDown = useCallback((shapeId: string) => {
    if (tool === 'eraser') {
      shapeManagerRef.current?.deleteShape(shapeId);
    }
  }, [tool, shapeManagerRef]);

  const handleShapePointerEnter = useCallback((shapeId: string, e: any) => {
    if (tool === 'eraser' && e.evt.buttons === 1) {
      shapeManagerRef.current?.deleteShape(shapeId);
    }
  }, [tool, shapeManagerRef]);

  return {
    handleShapeDragMove,
    handleShapeTransformEnd,
    handleShapeDblClick,
    handleFinishTextEdit,
    handleShapePointerDown,
    handleShapePointerEnter,
  };
}
