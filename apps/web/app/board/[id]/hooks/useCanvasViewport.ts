import { useEffect, useRef, useState, useCallback } from 'react';

interface UseCanvasViewportProps {
  stageRef: React.RefObject<any>;
  onUndo: () => void;
  onRedo: () => void;
}

export default function useCanvasViewport({ stageRef, onUndo, onRedo }: UseCanvasViewportProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const isSpacePressedRef = useRef(false);
  const isPanningRef = useRef(false);
  
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });

  // Handle window resizing dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Coordinate conversion helper (screen space -> canvas space)
  const toCanvas = useCallback((ptr: { x: number; y: number } | null) => {
    if (!ptr) return { x: 0, y: 0 };
    return {
      x: (ptr.x - position.x) / scale,
      y: (ptr.y - position.y) / scale,
    };
  }, [position, scale]);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') { 
        e.preventDefault(); 
        isSpacePressedRef.current = true; 
        setIsSpacePressed(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? onRedo() : onUndo();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        isSpacePressedRef.current = false;
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [onUndo, onRedo]);

  // Wheel zoom and pan
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Ignore canvas panning/zooming if wheeling inside an internally scrollable element
      let curEl: HTMLElement | null = target;
      while (curEl && curEl !== document.body) {
        const style = window.getComputedStyle(curEl);
        if (
          style.overflowY === 'auto' ||
          style.overflowY === 'scroll' ||
          style.overflowX === 'auto' ||
          style.overflowX === 'scroll'
        ) {
          return;
        }
        curEl = curEl.parentElement;
      }

      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const factor = 1.05;
        const stage = stageRef.current;
        if (!stage) return;
        const oldScale = stage.scaleX();
        const ptr = stage.getPointerPosition();
        if (!ptr) return;

        const mousePointTo = {
          x: (ptr.x - stage.x()) / oldScale,
          y: (ptr.y - stage.y()) / oldScale,
        };

        const newScale = e.deltaY < 0 ? oldScale * factor : oldScale / factor;
        const clampedScale = Math.min(Math.max(newScale, 0.1), 10);

        setScale(clampedScale);
        setPosition({
          x: ptr.x - mousePointTo.x * clampedScale,
          y: ptr.y - mousePointTo.y * clampedScale,
        });
      } else {
        setPosition((pos) => ({
          x: pos.x - e.deltaX,
          y: pos.y - e.deltaY,
        }));
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [scale, position, stageRef]);

  const handleZoom = (factor: number) =>
    setScale(s => Math.min(Math.max(s * factor, 0.1), 10));

  return {
    scale,
    setScale,
    position,
    setPosition,
    isSpacePressed,
    setIsSpacePressed,
    isPanning,
    setIsPanning,
    dimensions,
    toCanvas,
    handleZoom,
    isSpacePressedRef,
    isPanningRef
  };
}
