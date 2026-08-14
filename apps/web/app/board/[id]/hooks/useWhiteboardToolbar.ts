import { useState } from 'react';
import { ShapeType } from '@cocanvas/shared';

export function useWhiteboardToolbar() {
  const [tool, setTool] = useState<ShapeType | 'select' | 'eraser' | 'image' | 'comment' | 'laser' | 'bucket' | 'lasso' | 'draw_to_shape'>('select');
  const [selectedSubShape, setSelectedSubShape] = useState<'rectangle' | 'square' | 'rounded_rect' | 'ellipse' | 'circle' | 'triangle' | 'diamond'>('rectangle');
  const [color, setColor] = useState('#6366f1');
  const [strokeWidth, setStrokeWidth] = useState(4);       // pen / line / arrow
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2); // shapes only
  const [sharpness, setSharpness] = useState<'smooth' | 'sharp'>('smooth');
  const [eraserWidth, setEraserWidth] = useState(16);
  const [arrowDirection, setArrowDirection] = useState<'right' | 'both'>('right');
  const [penStyle, setPenStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState('normal');
  const [bgType, setBgType] = useState<'grid' | 'dots' | 'plain'>('grid');

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ x: 0, y: 0 });

  return {
    tool, setTool,
    selectedSubShape, setSelectedSubShape,
    color, setColor,
    strokeWidth, setStrokeWidth,
    shapeStrokeWidth, setShapeStrokeWidth,
    sharpness, setSharpness,
    eraserWidth, setEraserWidth,
    arrowDirection, setArrowDirection,
    penStyle, setPenStyle,
    fontSize, setFontSize,
    fontWeight, setFontWeight,
    bgType, setBgType,
    showHelpModal, setShowHelpModal,
    showEmojiPicker, setShowEmojiPicker,
    pickerPos, setPickerPos,
  };
}
