import React from 'react';
import ShapePanel from './ShapePanel';
import PenPanel from './PenPanel';
import LinePanel from './LinePanel';
import TextPanel from './TextPanel';
import EraserPanel from './EraserPanel';
import ArrowPanel from './ArrowPanel';

interface ToolbarContextPanelsProps {
  tool: string;
  selectedSubShape: 'rectangle' | 'square' | 'rounded_rect' | 'ellipse' | 'circle' | 'triangle' | 'diamond';
  setSelectedSubShape: (s: any) => void;
  setTool: (t: any) => void;
  color: string;
  setColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  sharpness: 'smooth' | 'sharp';
  setSharpness: (s: 'smooth' | 'sharp') => void;
  penStyle: 'solid' | 'dashed' | 'dotted';
  setPenStyle: (s: 'solid' | 'dashed' | 'dotted') => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  fontWeight: string;
  setFontWeight: (w: string) => void;
  eraserWidth: number;
  setEraserWidth: (w: number) => void;
  arrowDirection: 'right' | 'both';
  setArrowDirection: (d: 'right' | 'both') => void;
}

export default function ToolbarContextPanels({
  tool,
  selectedSubShape,
  setSelectedSubShape,
  setTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  sharpness,
  setSharpness,
  penStyle,
  setPenStyle,
  fontSize,
  setFontSize,
  fontWeight,
  setFontWeight,
  eraserWidth,
  setEraserWidth,
  arrowDirection,
  setArrowDirection,
}: ToolbarContextPanelsProps) {
  const shapeTypes = ['rectangle', 'square', 'rounded_rect', 'ellipse', 'circle', 'triangle', 'diamond'];
  const isShapeActive = shapeTypes.includes(tool as any);

  if (isShapeActive) {
    return (
      <ShapePanel
        selectedSubShape={selectedSubShape}
        setSelectedSubShape={setSelectedSubShape}
        setTool={setTool}
        color={color}
        setColor={setColor}
      />
    );
  }

  if (tool === 'freehand') {
    return (
      <PenPanel
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        sharpness={sharpness}
        setSharpness={setSharpness}
        penStyle={penStyle}
        setPenStyle={setPenStyle}
      />
    );
  }

  if (tool === 'line') {
    return (
      <LinePanel
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        penStyle={penStyle}
        setPenStyle={setPenStyle}
      />
    );
  }

  if (tool === 'text') {
    return (
      <TextPanel
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontWeight={fontWeight}
        setFontWeight={setFontWeight}
        color={color}
        setColor={setColor}
      />
    );
  }

  if (tool === 'eraser') {
    return (
      <EraserPanel
        eraserWidth={eraserWidth}
        setEraserWidth={setEraserWidth}
      />
    );
  }

  if (tool === 'arrow') {
    return (
      <ArrowPanel
        arrowDirection={arrowDirection}
        setArrowDirection={setArrowDirection}
        color={color}
        setColor={setColor}
      />
    );
  }

  return null;
}
