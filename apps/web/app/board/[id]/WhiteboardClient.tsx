'use client';

import { useRef, useState } from 'react';
import * as Y from 'yjs';
import { ShapeManager, PresenceManager } from '@cocanvas/crdt';

import useCanvasViewport from './hooks/useCanvasViewport';
import useShapeActions from './hooks/useShapeActions';
import useCanvasDrawing from './hooks/useCanvasDrawing';
import useCanvasSync from './hooks/useCanvasSync';
import useCanvasFileActions from './hooks/useCanvasFileActions';
import { useWhiteboardComments } from './hooks/useWhiteboardComments';
import { useWhiteboardAwareness } from './hooks/useWhiteboardAwareness';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useWhiteboardEvents } from './hooks/useWhiteboardEvents';
import { useWhiteboardToolbar } from './hooks/useWhiteboardToolbar';
import { WhiteboardCanvas } from './components/WhiteboardCanvas';
import { WhiteboardUI } from './components/WhiteboardUI';
import { BoardMember } from './WhiteboardWrapper';

interface UserMeta {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  role: 'viewer' | 'editor' | 'admin';
}

interface WhiteboardClientProps {
  board: { id: string; name: string; isPublic: boolean; ownerId: string; inviteToken: string | null };
  user: UserMeta;
  members: BoardMember[];
  wsUrl: string;
}

export default function WhiteboardClient({ board, user, members, wsUrl }: WhiteboardClientProps) {
  const {
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
  } = useWhiteboardToolbar();

  // Wrap setTool: reset pen-specific styles when leaving pen/line tools
  const PEN_TOOLS = new Set(['freehand', 'line']);
  const handleSetTool: typeof setTool = (next) => {
    if (!PEN_TOOLS.has(next as string) && PEN_TOOLS.has(tool as string)) {
      setSharpness('smooth');
      setPenStyle('solid');
    }
    setTool(next);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const doc = useRef(new Y.Doc()).current;
  const shapeManagerRef = useRef<ShapeManager | null>(null);
  const presenceManagerRef = useRef<PresenceManager | null>(null);
  const stageRef = useRef<any>(null);

  const { shapes, collaborators, isConnected } = useCanvasSync({
    doc,
    wsUrl,
    boardId: board.id,
    userId: user.id,
    userName: user.name,
    userImage: user.image,
    shapeManagerRef,
    presenceManagerRef,
  });

  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState('');
  const [editingTextPos, setEditingTextPos] = useState({ x: 0, y: 0 });

  const {
    scale, setScale,
    position, setPosition,
    isSpacePressed,
    isPanning,
    setIsPanning,
    dimensions,
    toCanvas,
    handleZoom,
    isSpacePressedRef,
    isPanningRef,
  } = useCanvasViewport({
    stageRef,
    onUndo: () => shapeManagerRef.current?.undo(),
    onRedo: () => shapeManagerRef.current?.redo(),
  });

  const {
    comments,
    newCommentPos,
    setNewCommentPos,
    newCommentText,
    setNewCommentText,
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
    handleCreateComment,
    handleSaveEditComment,
    handleDeleteComment,
  } = useWhiteboardComments({ boardId: board.id, doc });

  const {
    floatingReactions,
    laserTrails,
    setLaserTrails,
    mouseScreenPos,
    broadcastCursor,
    triggerReaction,
  } = useWhiteboardAwareness({
    collaborators,
    presenceManagerRef,
    stageRef,
    position,
    scale,
  });

  useKeyboardShortcuts({
    setTool: handleSetTool,
    setBgType,
    setShowHelpModal,
    setShowEmojiPicker,
    setPickerPos,
    mouseScreenPos,
    selectedSubShape,
  });

  const {
    handleShapeDragMove,
    handleShapeTransformEnd,
    handleShapeDblClick,
    handleFinishTextEdit,
    handleShapePointerDown,
    handleShapePointerEnter,
  } = useShapeActions({
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
  });

  const {
    liveShape,
    handleMouseDown: handleDrawingMouseDown,
    handleMouseMove: handleDrawingMouseMove,
    handleMouseUp: handleDrawingMouseUp,
  } = useCanvasDrawing({
    tool,
    setTool: handleSetTool,
    color,
    strokeWidth,
    shapeStrokeWidth,
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
  });

  const {
    handleImageUpload,
    handleFileChange,
    handleClear,
    handleExport,
  } = useCanvasFileActions({
    board,
    dimensions,
    position,
    scale,
    shapes,
    user,
    fileInputRef,
    stageRef,
    shapeManagerRef,
  });

  const {
    lassoPoints,
    contextMenu,
    setContextMenu,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    shapeProps,
    getCursorStyle,
  } = useWhiteboardEvents({
    tool,
    setTool: handleSetTool,
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
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: 'var(--color-bg-primary)', overflow: 'hidden' }}>
      <WhiteboardCanvas
        stageRef={stageRef}
        bgType={bgType}
        scale={scale}
        position={position}
        dimensions={dimensions}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        getCursorStyle={getCursorStyle}
        shapes={shapes}
        selectedShapeId={selectedShapeId}
        liveShape={liveShape}
        lassoPoints={lassoPoints}
        laserTrails={laserTrails}
        collaborators={collaborators}
        shapeProps={shapeProps}
      />

      <WhiteboardUI
        board={board}
        user={user}
        members={members}
        collaborators={collaborators}
        isConnected={isConnected}
        handleExport={handleExport}
        tool={tool}
        setTool={handleSetTool}
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
        shapeManagerRef={shapeManagerRef}
        handleClear={handleClear}
        handleImageUpload={handleImageUpload}
        handleZoom={handleZoom}
        scale={scale}
        setScale={setScale}
        bgType={bgType}
        setBgType={setBgType}
        triggerReaction={triggerReaction}
        editingTextId={editingTextId}
        editingTextValue={editingTextValue}
        setEditingTextValue={setEditingTextValue}
        handleFinishTextEdit={handleFinishTextEdit}
        editingTextPos={editingTextPos}
        shapes={shapes}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        selectedShapeId={selectedShapeId}
        setSelectedShapeId={setSelectedShapeId}
        position={position}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
        floatingReactions={floatingReactions}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        pickerPos={pickerPos}
        comments={comments}
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
        handleDeleteComment={handleDeleteComment}
        handleSaveEditComment={handleSaveEditComment}
        newCommentPos={newCommentPos}
        newCommentText={newCommentText}
        setNewCommentText={setNewCommentText}
        setNewCommentPos={setNewCommentPos}
        handleCreateComment={handleCreateComment}
        showHelpModal={showHelpModal}
        setShowHelpModal={setShowHelpModal}
      />
    </div>
  );
}
