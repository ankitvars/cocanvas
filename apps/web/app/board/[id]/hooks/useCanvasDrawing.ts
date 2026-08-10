import { useState, useRef, useCallback } from 'react';
import { Shape } from '@cocanvas/shared';

interface UseCanvasDrawingProps {
  tool: string;
  setTool: (t: any) => void;
  color: string;
  strokeWidth: number;
  sharpness: 'smooth' | 'sharp';
  penStyle: 'solid' | 'dashed' | 'dotted';
  fontSize: number;
  fontWeight: string;
  eraserWidth: number;
  arrowDirection: 'right' | 'both';
  scale: number;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  toCanvas: (ptr: { x: number; y: number } | null) => { x: number; y: number };
  shapeManagerRef: React.RefObject<any>;
  shapes: any[];
  user: { name: string; role: string };
  setSelectedShapeId: (id: string | null) => void;
  setEditingTextId: (id: string | null) => void;
  setEditingTextValue: (v: string) => void;
  setEditingTextPos: (pos: { x: number; y: number }) => void;
  isPanningRef: React.RefObject<boolean>;
  setIsPanning: (p: boolean) => void;
  isSpacePressedRef: React.RefObject<boolean>;
  presenceManagerRef: React.RefObject<any>;
  broadcastCursor: (x: number, y: number) => void;
}

const recognizeShape = (pts: number[]): 'line' | 'rectangle' | 'ellipse' | 'triangle' => {
  if (pts.length < 6) return 'line';
  const x1 = pts[0], y1 = pts[1];
  const x2 = pts[pts.length - 2], y2 = pts[pts.length - 1];
  
  // Bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < pts.length; i += 2) {
    const px = pts[i], py = pts[i+1];
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  }
  const w = maxX - minX;
  const h = maxY - minY;
  
  const startEndDist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  
  // Calculate total path length
  let pathLength = 0;
  for (let i = 0; i < pts.length - 2; i += 2) {
    pathLength += Math.sqrt((pts[i+2] - pts[i]) ** 2 + (pts[i+3] - pts[i+1]) ** 2);
  }
  
  // 1. Line check: if start and end distance is very close to path length
  if (startEndDist > pathLength * 0.8) {
    return 'line';
  }
  
  // 2. Closed shape check
  const isClosed = startEndDist < pathLength * 0.35 || startEndDist < 50;
  if (isClosed) {
    // Corner detector: sample segments and check angles
    const segmentCount = 8;
    const sampledPts: {x: number, y: number}[] = [];
    for (let i = 0; i < segmentCount; i++) {
      const idx = Math.floor((i / segmentCount) * (pts.length / 2)) * 2;
      sampledPts.push({ x: pts[idx], y: pts[idx+1] });
    }
    sampledPts.push(sampledPts[0]); // close loop
    
    let corners = 0;
    for (let i = 1; i < sampledPts.length - 1; i++) {
      const prev = sampledPts[i-1];
      const curr = sampledPts[i];
      const next = sampledPts[i+1];
      
      const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const v2 = { x: next.x - curr.x, y: next.y - curr.y };
      
      const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      
      if (len1 > 0 && len2 > 0) {
        const dot = v1.x * v2.x + v1.y * v2.y;
        const cosAngle = dot / (len1 * len2);
        if (cosAngle < 0.5) { // sharp turn
          corners++;
        }
      }
    }
    
    if (corners === 3) return 'triangle';
    if (corners >= 4) return 'rectangle';
    return 'ellipse';
  }
  
  return 'line';
};

export default function useCanvasDrawing({
  tool,
  setTool,
  color,
  strokeWidth,
  sharpness,
  penStyle,
  fontSize,
  fontWeight,
  eraserWidth,
  arrowDirection,
  scale,
  position,
  setPosition,
  toCanvas,
  shapeManagerRef,
  shapes,
  user,
  setSelectedShapeId,
  setEditingTextId,
  setEditingTextValue,
  setEditingTextPos,
  isPanningRef,
  setIsPanning,
  isSpacePressedRef,
  presenceManagerRef,
  broadcastCursor,
}: UseCanvasDrawingProps) {
  const isDrawingRef = useRef(false);
  const liveShapeRef = useRef<Shape | null>(null);
  const [liveShape, setLiveShape] = useState<Shape | null>(null);

  // Pointer drag start
  const handleMouseDown = useCallback((e: any) => {
    const stage = e.target.getStage();
    const ptr = stage.getPointerPosition();

    if (isSpacePressedRef.current || (tool === 'select' && e.evt.button === 1)) {
      isPanningRef.current = true;
      setIsPanning(true);
      return;
    }

    const { x, y } = toCanvas(ptr);

    if (tool === 'select') {
      const id = e.target.attrs.id || null;
      setSelectedShapeId(id);
      presenceManagerRef.current?.setSelection(id ? [id] : []);
      return;
    }

    if (['eraser', 'image', 'comment', 'laser', 'bucket', 'lasso'].includes(tool)) return;

    if (!shapeManagerRef.current || user.role === 'viewer') return;

    const shapeId = crypto.randomUUID();

    const base: Shape = {
      id: shapeId,
      type: (tool === 'draw_to_shape') ? 'freehand' : tool as any,
      x, y,
      width: 0, height: 0,
      rotation: 0,
      fill: tool === 'frame' ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
      stroke: tool === 'frame' ? '#94a3b8' : color,
      strokeWidth: tool === 'frame' ? 1.5 : strokeWidth,
      opacity: 1,
      zIndex: shapes.length,
      createdBy: user.name,
      createdAt: Date.now(),
      lineCap: sharpness === 'smooth' ? 'round' : 'square',
      lineJoin: sharpness === 'smooth' ? 'round' : 'miter',
      dash: penStyle === 'dashed' ? [12, 12]
          : penStyle === 'dotted' ? [1, 10]
          : undefined,
      ...(tool === 'freehand' && { points: [x, y] }),
      ...(tool === 'draw_to_shape' && { points: [x, y] }),
      ...(tool === 'line'     && { points: [x, y, x, y] }),
      ...(tool === 'arrow'    && { points: [x, y, x, y], arrowDirection }),
      ...(tool === 'text'     && { text: '', fontSize, fontFamily: 'sans-serif', fontWeight }),
      ...(tool === 'sticky'   && { text: 'Sticky Note', color: '#fef08a' }),
      ...(tool === 'triangle' && { sides: 3 }),
      ...(tool === 'diamond'  && { sides: 4 }),
      ...(tool === 'rounded_rect' && { cornerRadius: 16 }),
      ...(tool === 'frame' && { name: 'Frame' } as any),
      ...(tool === 'embed' && { src: '' } as any),
    } as Shape;

    if (tool === 'text' || tool === 'sticky') {
      shapeManagerRef.current.addShape(base);
      setTool('select');
      setSelectedShapeId(shapeId);
      
      if (tool === 'text') {
        const screenX = x * scale + position.x;
        const screenY = y * scale + position.y;
        setEditingTextId(shapeId);
        setEditingTextValue('');
        setEditingTextPos({ x: screenX, y: screenY });
      }
      return;
    }

    isDrawingRef.current = true;
    liveShapeRef.current = base;
    setLiveShape({ ...base });
  }, [tool, color, strokeWidth, shapes.length, user.name, user.role, toCanvas, sharpness, eraserWidth, arrowDirection, position.x, position.y, scale, penStyle, fontSize, fontWeight, setTool, setSelectedShapeId, setEditingTextId, setEditingTextValue, setEditingTextPos, isPanningRef, setIsPanning, isSpacePressedRef, presenceManagerRef]);

  // Dragging shape or moving mouse
  const handleMouseMove = useCallback((e: any) => {
    const stage = e.target.getStage();
    const ptr = stage.getPointerPosition();

    if (isPanningRef.current) {
      setPosition((prev: { x: number; y: number }) => ({
        x: prev.x + e.evt.movementX,
        y: prev.y + e.evt.movementY,
      }));
      return;
    }

    const { x, y } = toCanvas(ptr);
    broadcastCursor(x, y);
    
    if (tool === 'eraser' && e.evt.buttons === 1) {
      const intersection = stage.getIntersection(ptr);
      if (intersection && intersection.attrs.id) {
        shapeManagerRef.current?.deleteShape(intersection.attrs.id);
      }
    }

    if (!isDrawingRef.current || !liveShapeRef.current) return;

    const cur = liveShapeRef.current;
    let updated: Partial<Shape>;

    if (cur.type === 'freehand' || tool === 'draw_to_shape') {
      const pts = [...(cur as any).points, x, y];
      updated = { points: pts } as any;
    } else if (cur.type === 'line' || cur.type === 'arrow') {
      const pts = [(cur as any).points[0], (cur as any).points[1], x, y];
      updated = { points: pts } as any;
    } else if (cur.type === 'square') {
      const side = Math.max(Math.abs(x - cur.x), Math.abs(y - cur.y));
      updated = {
        width: x < cur.x ? -side : side,
        height: y < cur.y ? -side : side,
      };
    } else if (cur.type === 'circle') {
      const radius = Math.max(Math.abs(x - cur.x), Math.abs(y - cur.y));
      updated = {
        width: x < cur.x ? -radius : radius,
        height: y < cur.y ? -radius : radius,
      };
    } else if (cur.type === 'triangle') {
      const dx = x - cur.x;
      const dy = y - cur.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      updated = { width: radius * 2, height: radius * 2 };
    } else {
      updated = { width: x - cur.x, height: y - cur.y };
    }

    liveShapeRef.current = { ...(cur as any), ...updated } as Shape;
    setLiveShape({ ...liveShapeRef.current });
  }, [toCanvas, broadcastCursor, tool, shapeManagerRef, setPosition, isPanningRef]);

  // End drawing
  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
    setIsPanning(false);
    if (!isDrawingRef.current || !liveShapeRef.current) return;
    isDrawingRef.current = false;

    const cur = liveShapeRef.current;

    if (tool === 'draw_to_shape') {
      const pts = (cur as any).points || [];
      const recognizedType = recognizeShape(pts);
      
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < pts.length; i += 2) {
        const px = pts[i], py = pts[i+1];
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }
      const w = maxX - minX;
      const h = maxY - minY;

      if (w > 5 && h > 5) {
        const finalShape: any = {
          ...cur,
          type: recognizedType,
          x: minX,
          y: minY,
          width: w,
          height: h,
        };

        if (recognizedType === 'line') {
          finalShape.points = [pts[0], pts[1], pts[pts.length - 2], pts[pts.length - 1]];
        } else if (recognizedType === 'triangle') {
          finalShape.sides = 3;
        }

        shapeManagerRef.current?.addShape(finalShape);
      }
    } else if ((cur.type as string) === 'frame') {
      const frameCount = shapes.filter(s => (s.type as string) === 'frame').length;
      shapeManagerRef.current?.addShape({
        ...(cur as any),
        name: `Frame ${frameCount + 1}`,
      } as any);
    } else if ((cur.type as string) === 'embed') {
      shapeManagerRef.current?.addShape({
        ...(cur as any),
        src: "",
      } as any);
    } else {
      shapeManagerRef.current?.addShape(cur);
    }

    shapeManagerRef.current?.stopCapturing();
    liveShapeRef.current = null;
    setLiveShape(null);
  }, [shapeManagerRef, isPanningRef, setIsPanning, tool]);

  return {
    liveShape,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
