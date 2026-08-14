'use client';

import React, { useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';
import { Shape, ShapeType } from '@cocanvas/shared';
import { ShapeManager } from '@cocanvas/crdt';

import CanvasHeader from './CanvasHeader';
import CanvasToolbar from './CanvasToolbar';
import CanvasControls from './CanvasControls';
import FloatingToolbar from './FloatingToolbar';
import WebEmbedsOverlay from './WebEmbedsOverlay';
import CommentsOverlay from './CommentsOverlay';
import EmojiPickerOverlay from './EmojiPickerOverlay';
import HelpModalOverlay from './HelpModalOverlay';
import { NewCommentForm } from './NewCommentForm';
import { getOptimizedAvatarUrl } from '../../../../lib/utils';
import { BoardMember } from '../WhiteboardWrapper';

interface UserMeta {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  role: 'viewer' | 'editor' | 'admin';
}

interface WhiteboardUIProps {
  board: { id: string; name: string; isPublic: boolean; ownerId: string; inviteToken: string | null };
  user: UserMeta;
  members: BoardMember[];
  collaborators: any[];
  isConnected: boolean;
  handleExport: (format: 'png' | 'pdf') => void;
  tool: ShapeType | 'select' | 'eraser' | 'image' | 'comment' | 'laser' | 'bucket' | 'lasso' | 'draw_to_shape';
  setTool: (tool: ShapeType | 'select' | 'eraser' | 'image' | 'comment' | 'laser' | 'bucket' | 'lasso' | 'draw_to_shape') => void;
  selectedSubShape: 'rectangle' | 'square' | 'rounded_rect' | 'ellipse' | 'circle' | 'triangle' | 'diamond';
  setSelectedSubShape: (sub: 'rectangle' | 'square' | 'rounded_rect' | 'ellipse' | 'circle' | 'triangle' | 'diamond') => void;
  color: string;
  setColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  shapeStrokeWidth: number;
  setShapeStrokeWidth: (w: number) => void;
  sharpness: 'smooth' | 'sharp';
  setSharpness: (s: 'smooth' | 'sharp') => void;
  penStyle: 'solid' | 'dashed' | 'dotted';
  setPenStyle: (style: 'solid' | 'dashed' | 'dotted') => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontWeight: string;
  setFontWeight: (w: string) => void;
  eraserWidth: number;
  setEraserWidth: (w: number) => void;
  arrowDirection: 'right' | 'both';
  setArrowDirection: (dir: 'right' | 'both') => void;
  shapeManagerRef: React.RefObject<ShapeManager | null>;
  handleClear: () => void;
  handleImageUpload: () => void;
  handleZoom: (zoom: any) => void;
  scale: number;
  setScale: (scale: number) => void;
  bgType: 'grid' | 'dots' | 'plain';
  setBgType: React.Dispatch<React.SetStateAction<'grid' | 'dots' | 'plain'>>;
  triggerReaction: (emoji: string) => void;
  editingTextId: string | null;
  editingTextValue: string;
  setEditingTextValue: (val: string) => void;
  handleFinishTextEdit: () => void;
  editingTextPos: { x: number; y: number };
  shapes: Shape[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedShapeId: string | null;
  setSelectedShapeId: (id: string | null) => void;
  position: { x: number; y: number };
  contextMenu: { x: number; y: number; visible: boolean; shapeId: string } | null;
  setContextMenu: React.Dispatch<React.SetStateAction<{ x: number; y: number; visible: boolean; shapeId: string } | null>>;
  floatingReactions: { id: string; emoji: string; x: number; y: number; createdAt: number }[];
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  pickerPos: { x: number; y: number };
  comments: any[];
  activeCommentId: string | null;
  setActiveCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  collapsedCommentIds: string[];
  setCollapsedCommentIds: React.Dispatch<React.SetStateAction<string[]>>;
  hoveredCommentId: string | null;
  setHoveredCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  editingCommentId: string | null;
  setEditingCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  editingCommentText: string;
  setEditingCommentText: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteComment: (commentId: string) => void;
  handleSaveEditComment: (commentId: string, text: string) => void;
  newCommentPos: { x: number; y: number } | null;
  newCommentText: string;
  setNewCommentText: (text: string) => void;
  setNewCommentPos: (pos: { x: number; y: number } | null) => void;
  handleCreateComment: (text: string) => void;
  showHelpModal: boolean;
  setShowHelpModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function WhiteboardUI({
  board,
  user,
  members,
  collaborators,
  isConnected,
  handleExport,
  tool,
  setTool,
  selectedSubShape,
  setSelectedSubShape,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  shapeStrokeWidth,
  setShapeStrokeWidth,
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
  shapeManagerRef,
  handleClear,
  handleImageUpload,
  handleZoom,
  scale,
  setScale,
  bgType,
  setBgType,
  triggerReaction,
  editingTextId,
  editingTextValue,
  setEditingTextValue,
  handleFinishTextEdit,
  editingTextPos,
  shapes,
  fileInputRef,
  handleFileChange,
  selectedShapeId,
  setSelectedShapeId,
  position,
  contextMenu,
  setContextMenu,
  floatingReactions,
  showEmojiPicker,
  setShowEmojiPicker,
  pickerPos,
  comments,
  activeCommentId,
  setActiveCommentId,
  collapsedCommentIds,
  setCollapsedCommentIds,
  hoveredCommentId,
  setHoveredCommentId,
  editingCommentId,
  setEditingCommentId,
  editingCommentText,
  setEditingCommentText,
  handleDeleteComment,
  handleSaveEditComment,
  newCommentPos,
  newCommentText,
  setNewCommentText,
  setNewCommentPos,
  handleCreateComment,
  showHelpModal,
  setShowHelpModal,
}: WhiteboardUIProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editingTextValue, editingTextId]);

  useEffect(() => {
    if (editingTextId && textareaRef.current) {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [editingTextId]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('canvas-locked');
      document.documentElement.classList.add('canvas-locked');
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('canvas-locked');
        document.documentElement.classList.remove('canvas-locked');
      }
    };
  }, []);

  return (
    <>
      <CanvasHeader
        board={board}
        currentUser={user}
        members={members}
        collaborators={collaborators}
        isConnected={isConnected}
        handleExport={handleExport}
      />

      <CanvasToolbar
        tool={tool}
        setTool={setTool}
        selectedSubShape={selectedSubShape}
        setSelectedSubShape={setSelectedSubShape}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        shapeStrokeWidth={shapeStrokeWidth}
        setShapeStrokeWidth={setShapeStrokeWidth}
        sharpness={sharpness}
        setSharpness={setSharpness}
        penStyle={penStyle}
        setPenStyle={setPenStyle}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontWeight={fontWeight}
        setFontWeight={setFontWeight}
        eraserWidth={eraserWidth}
        setEraserWidth={setEraserWidth}
        arrowDirection={arrowDirection}
        setArrowDirection={setArrowDirection}
        onUndo={() => shapeManagerRef.current?.undo()}
        onRedo={() => shapeManagerRef.current?.redo()}
        onClear={handleClear}
        onImageUpload={handleImageUpload}
      />

      <CanvasControls
        handleZoom={handleZoom}
        scale={scale}
        setScale={setScale}
        bgType={bgType}
        setBgType={setBgType}
        triggerReaction={triggerReaction}
      />

      {/* Rich Inline Text Editor Over Stage */}
      {editingTextId && (
        <textarea
          ref={textareaRef}
          value={editingTextValue}
          onChange={(e) => setEditingTextValue(e.target.value)}
          onBlur={handleFinishTextEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleFinishTextEdit();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              handleFinishTextEdit();
            }
          }}
          placeholder="Type text..."
          style={{
            position: 'absolute',
            left: `${editingTextPos.x}px`,
            top: `${editingTextPos.y}px`,
            fontSize: `${
              (shapes.find((s) => s.id === editingTextId) as any)?.fontSize * scale || 16 * scale
            }px`,
            fontWeight:
              (shapes.find((s) => s.id === editingTextId) as any)?.fontWeight === 'bold'
                ? 'bold'
                : 'normal',
            background: 'transparent',
            border: 'none',
            color: shapes.find((s) => s.id === editingTextId)?.stroke || '#fff',
            caretColor: 'var(--color-accent-primary)',
            zIndex: 50,
            outline: 'none',
            padding: '0px',
            margin: '0px',
            fontFamily: 'sans-serif',
            width: `${((shapes.find((s) => s.id === editingTextId) as any)?.width || 300) * scale}px`,
            minHeight: '24px',
            resize: 'none',
            overflow: 'hidden',
          }}
        />
      )}

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {selectedShapeId && shapes.find((s) => s.id === selectedShapeId) && !editingTextId && (
        <FloatingToolbar
          shape={shapes.find((s) => s.id === selectedShapeId)!}
          onUpdate={(id, updates) => shapeManagerRef.current?.updateShape(id, updates)}
          onDelete={(id) => {
            shapeManagerRef.current?.deleteShape(id);
            setSelectedShapeId(null);
          }}
          scale={scale}
          position={position}
        />
      )}

      {contextMenu?.visible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            padding: '4px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: '130px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const targetShape = shapes.find((s) => s.id === contextMenu.shapeId);
              if (targetShape) {
                shapeManagerRef.current?.toggleLockShape(targetShape.id);
              }
              setContextMenu(null);
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span>
              {shapes.find((s) => s.id === contextMenu.shapeId)?.locked ? '🔓 Unlock' : '🔒 Lock'}
            </span>
          </button>

          {!shapes.find((s) => s.id === contextMenu.shapeId)?.locked && (
            <button
              onClick={() => {
                shapeManagerRef.current?.deleteShape(contextMenu.shapeId);
                setContextMenu(null);
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}

      {/* Floating Emojis Container */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translate(-50%, -50%) translateY(0) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(-120px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>

      {floatingReactions.map((r) => (
        <div
          key={r.id}
          style={{
            position: 'absolute',
            left: r.x * scale + position.x,
            top: r.y * scale + position.y,
            fontSize: '28px',
            pointerEvents: 'none',
            userSelect: 'none',
            animation: 'float-up 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            zIndex: 999999,
          }}
        >
          {r.emoji}
        </div>
      ))}

      {/* Floating Emoji Picker from Shortcut E */}
      <EmojiPickerOverlay
        showEmojiPicker={showEmojiPicker}
        pickerPos={pickerPos}
        broadcastReaction={triggerReaction}
        setShowEmojiPicker={setShowEmojiPicker}
      />

      {/* Web Embeds Overlays */}
      <WebEmbedsOverlay
        shapes={shapes}
        scale={scale}
        position={position}
        selectedShapeId={selectedShapeId}
        onUpdate={(id, updates) => shapeManagerRef.current?.updateShape(id, updates)}
      />

      {/* Canvas Comment Pins Overlays */}
      <CommentsOverlay
        comments={comments}
        scale={scale}
        position={position}
        activeCommentId={activeCommentId}
        setActiveCommentId={setActiveCommentId}
        collapsedCommentIds={collapsedCommentIds}
        setCollapsedCommentIds={setCollapsedCommentIds}
        hoveredCommentId={hoveredCommentId}
        setHoveredCommentId={setHoveredCommentId}
        editingCommentId={editingCommentId}
        setEditingCommentId={setEditingCommentId}
        editingCommentText={editingCommentText}
        setEditingCommentText={setEditingCommentText}
        user={user}
        handleDeleteComment={handleDeleteComment}
        handleSaveEditComment={handleSaveEditComment}
        getOptimizedAvatarUrl={getOptimizedAvatarUrl}
      />

      {/* New Comment Dropped Pin input form */}
      <NewCommentForm
        newCommentPos={newCommentPos}
        newCommentText={newCommentText}
        setNewCommentText={setNewCommentText}
        setNewCommentPos={setNewCommentPos}
        handleCreateComment={handleCreateComment}
        scale={scale}
        position={position}
      />

      {/* Help Circle Icon (Bottom Right) */}
      <button
        onClick={() => setShowHelpModal(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'var(--shadow-lg)',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 99999,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Help & Shortcuts (?)"
      >
        <HelpCircle size={20} />
      </button>

      {/* Help Modal Overlay */}
      <HelpModalOverlay showHelpModal={showHelpModal} setShowHelpModal={setShowHelpModal} />
    </>
  );
}
