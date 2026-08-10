export type ShapeType = 
  | 'rectangle' 
  | 'square'
  | 'rounded_rect'
  | 'ellipse' 
  | 'circle'
  | 'triangle'
  | 'diamond'
  | 'line' 
  | 'arrow' 
  | 'freehand' 
  | 'text' 
  | 'sticky'
  | 'image'
  | 'embed'
  | 'frame'
  | 'eraser';

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  zIndex: number;
  createdBy: string;
  createdAt: number;
  locked?: boolean;
  frameId?: string | null;
  lineCap?: 'round' | 'square' | 'butt';
  lineJoin?: 'round' | 'miter' | 'bevel';
  dash?: number[];
}

export interface RectShape extends BaseShape {
  type: 'rectangle' | 'square' | 'rounded_rect';
  cornerRadius?: number;
}

export interface EllipseShape extends BaseShape {
  type: 'ellipse' | 'circle';
}

export interface RegularPolygonShape extends BaseShape {
  type: 'triangle';
  sides: number;
}

export interface DiamondShape extends BaseShape {
  type: 'diamond';
}

export interface LineShape extends BaseShape {
  type: 'line' | 'arrow';
  points: number[]; // Flat array of [x1, y1, x2, y2, ...]
  arrowDirection?: 'left' | 'right' | 'both';
}

export interface FreehandShape extends BaseShape {
  type: 'freehand' | 'eraser';
  points: number[]; // Flat array of coordinates
}

export interface TextShape extends BaseShape {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: string;
}

export interface StickyShape extends BaseShape {
  type: 'sticky';
  text: string;
  color: string;
}

export interface ImageShape extends BaseShape {
  type: 'image';
  src: string; // Base64 or URL
}

export interface EmbedShape extends BaseShape {
  type: 'embed';
  src: string;
}

export interface FrameShape extends BaseShape {
  type: 'frame';
  name: string;
}

export type Shape = 
  | RectShape 
  | EllipseShape 
  | RegularPolygonShape 
  | DiamondShape
  | LineShape 
  | FreehandShape 
  | TextShape 
  | StickyShape
  | ImageShape
  | EmbedShape
  | FrameShape;
