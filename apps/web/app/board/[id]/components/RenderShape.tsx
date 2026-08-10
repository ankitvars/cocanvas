import React from 'react';
import { Group, Rect, Ellipse, RegularPolygon, Line as KonvaLine, Arrow as KonvaArrow, Text as KonvaText, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { Shape } from '@cocanvas/shared';

const RenderImageShape = ({ shape, base }: { shape: any, base: any }) => {
  const [img] = useImage(shape.src);
  return <KonvaImage key={base.id} {...base} image={img} x={shape.x} y={shape.y} width={shape.width} height={shape.height} />;
};

interface RenderShapeProps {
  shape: Shape;
  isLive?: boolean;
  base: any;
}

export default function RenderShape({ shape, isLive = false, base }: RenderShapeProps) {
  const elementKey = isLive ? 'live' : shape.id;

  const renderShapeElement = () => {
    if (shape.type === 'rectangle' || shape.type === 'square' || shape.type === 'rounded_rect') {
      const rx = shape.width < 0 ? shape.x + shape.width : shape.x;
      const ry = shape.height < 0 ? shape.y + shape.height : shape.y;
      const rw = Math.abs(shape.width);
      const rh = Math.abs(shape.height);
      return <Rect key={elementKey} {...base} x={rx} y={ry}
        width={rw} height={rh}
        cornerRadius={Math.max(0, (shape as any).cornerRadius || 0)}
        fill={shape.fill === 'transparent' ? undefined : shape.fill}
        stroke={shape.stroke} strokeWidth={shape.strokeWidth}
        lineCap="round"
        dash={shape.dash} />;
    }
    if (shape.type === 'ellipse' || shape.type === 'circle') {
      return <Ellipse key={elementKey} {...base}
        x={shape.x + shape.width / 2} y={shape.y + shape.height / 2}
        radiusX={Math.abs(shape.width / 2)} radiusY={Math.abs(shape.height / 2)}
        fill={shape.fill === 'transparent' ? undefined : shape.fill}
        stroke={shape.stroke} strokeWidth={shape.strokeWidth}
        lineCap="round"
        dash={shape.dash} />;
    }
    if ((shape.type as string) === 'triangle') {
      const radius = Math.abs(shape.width / 2);
      return <RegularPolygon key={elementKey} {...base}
        x={shape.x + radius} y={shape.y + radius}
        sides={3} radius={radius} rotation={0}
        fill={shape.fill === 'transparent' ? undefined : shape.fill}
        stroke={shape.stroke} strokeWidth={shape.strokeWidth}
        lineCap="round"
        dash={shape.dash} />;
    }
    if ((shape.type as string) === 'diamond') {
      const w = shape.width;
      const h = shape.height;
      return <KonvaLine key={elementKey} {...base}
        x={shape.x} y={shape.y}
        points={[w / 2, 0, w, h / 2, w / 2, h, 0, h / 2]}
        closed={true}
        fill={shape.fill === 'transparent' ? undefined : shape.fill}
        stroke={shape.stroke} strokeWidth={shape.strokeWidth}
        lineCap="round"
        lineJoin="round"
        dash={shape.dash} />;
    }
    if (shape.type === 'freehand') {
      return <KonvaLine key={elementKey} {...base} points={(shape as any).points}
        stroke={shape.stroke} strokeWidth={shape.strokeWidth}
        lineCap={shape.lineCap || 'round'} lineJoin={shape.lineJoin || 'round'}
        dash={shape.dash}
        tension={0.4} />;
    }

    if (shape.type === 'line') {
      return <KonvaLine key={elementKey} {...base} points={(shape as any).points}
        stroke={shape.stroke} strokeWidth={shape.strokeWidth}
        lineCap={shape.lineCap || 'round'} lineJoin={shape.lineJoin || 'round'}
        dash={shape.dash} />;
    }
    if (shape.type === 'arrow') {
      const direction = (shape as any).arrowDirection || 'right';
      return <KonvaArrow key={elementKey} {...base} points={(shape as any).points}
        stroke={shape.stroke} strokeWidth={shape.strokeWidth}
        fill={shape.stroke}
        pointerAtBeginning={direction === 'left' || direction === 'both'}
        pointerAtEnding={direction === 'right' || direction === 'both'}
        lineCap={shape.lineCap || 'round'} lineJoin={shape.lineJoin || 'round'}
        dash={shape.dash} />;
    }
    if (shape.type === 'text') {
      return <KonvaText key={elementKey} {...base} x={shape.x} y={shape.y}
        text={(shape as any).text} fontSize={(shape as any).fontSize || 16}
        fontFamily={(shape as any).fontFamily || 'sans-serif'}
        fontStyle={(shape as any).fontWeight === 'bold' ? 'bold' : 'normal'}
        fill={shape.stroke} />;
    }
    if (shape.type === 'image') {
      return <RenderImageShape key={elementKey} shape={shape} base={base} />;
    }
    if ((shape.type as string) === 'frame') {
      const s = shape as any;
      return (
        <Group key={elementKey} {...base}>
          <Rect
            x={s.x}
            y={s.y}
            width={s.width}
            height={s.height}
            fill="rgba(255, 255, 255, 0.02)"
            stroke="#94a3b8"
            strokeWidth={1.5}
            dash={[6, 6]}
            cornerRadius={4}
          />
          <KonvaText
            x={s.x + 8}
            y={s.y - 18}
            text={s.name || 'Frame'}
            fontSize={12}
            fontStyle="bold"
            fill="#94a3b8"
          />
        </Group>
      );
    }
    return null;
  };

  const element = renderShapeElement();

  if (shape.locked && !isLive) {
    const lockX = (shape as any).points?.[0] ?? shape.x;
    const lockY = ((shape as any).points?.[1] ?? shape.y) - 18;
    return (
      <Group key={elementKey}>
        {element}
        <KonvaText
          x={lockX}
          y={lockY}
          text="🔒"
          fontSize={12}
          listening={false}
        />
      </Group>
    );
  }

  return element;
}
