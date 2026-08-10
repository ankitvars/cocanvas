'use client';

import { useEffect } from 'react';
import { ShapeType } from '@cocanvas/shared';

interface UseKeyboardShortcutsProps {
  setTool: (tool: ShapeType | 'select' | 'eraser' | 'image' | 'comment' | 'laser' | 'bucket' | 'lasso' | 'draw_to_shape') => void;
  setBgType: React.Dispatch<React.SetStateAction<'grid' | 'dots' | 'plain'>>;
  setShowHelpModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  setPickerPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  mouseScreenPos: { x: number; y: number };
}

export function useKeyboardShortcuts({
  setTool,
  setBgType,
  setShowHelpModal,
  setShowEmojiPicker,
  setPickerPos,
  mouseScreenPos,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.hasAttribute('contenteditable')
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Let standard copy/paste/undo combinations pass through
      if (e.ctrlKey || e.metaKey) {
        if (key === '/') {
          e.preventDefault();
          setShowHelpModal((prev) => !prev);
        }
        return;
      }

      // Help Modal is active on `/` or `?`
      const isHelp = key === '/' || e.key === '?';

      // All tool and utility shortcuts MUST use the Shift key
      if (!e.shiftKey && !isHelp) {
        return;
      }

      if (key === 'v' || key === '1' || e.key === '!') {
        e.preventDefault();
        setTool('select');
      } else if (key === 'r' || key === '2' || e.key === '@') {
        e.preventDefault();
        setTool('rectangle');
      } else if (key === 'd' || key === '3' || e.key === '#') {
        e.preventDefault();
        setTool('diamond');
      } else if (key === 'o' || key === '4' || e.key === '$') {
        e.preventDefault();
        setTool('ellipse');
      } else if (key === 'a' || key === '5' || e.key === '%') {
        e.preventDefault();
        setTool('arrow');
      } else if (key === 'l' || key === '6' || e.key === '^') {
        e.preventDefault();
        setTool('line');
      } else if (key === 'p' || key === '7' || e.key === '&') {
        e.preventDefault();
        setTool('freehand');
      } else if (key === 't' || key === '8' || e.key === '*') {
        e.preventDefault();
        setTool('text');
      } else if (key === '9' || e.key === '(') {
        e.preventDefault();
        setTool('image');
      } else if (key === 'e' || key === '0' || e.key === ')') {
        e.preventDefault();
        setTool('eraser');
      } else if (key === 'f') {
        e.preventDefault();
        setTool('frame');
      } else if (key === 'k') {
        e.preventDefault();
        setTool('laser');
      } else if (key === 'b') {
        e.preventDefault();
        setTool('bucket');
      } else if (key === 's') {
        e.preventDefault();
        setTool('lasso');
      } else if (key === 'x') {
        e.preventDefault();
        setTool('draw_to_shape');
      } else if (key === 'q') {
        e.preventDefault();
        setPickerPos({ x: mouseScreenPos.x, y: mouseScreenPos.y });
        setShowEmojiPicker((prev) => !prev);
      } else if (key === 'g') {
        e.preventDefault();
        setBgType((prev) => (prev === 'grid' ? 'dots' : prev === 'dots' ? 'plain' : 'grid'));
      } else if (isHelp) {
        e.preventDefault();
        setShowHelpModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mouseScreenPos, setTool, setBgType, setShowHelpModal, setShowEmojiPicker, setPickerPos]);
}
