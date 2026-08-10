import { jsPDF } from "jspdf";
import { Shape } from "@cocanvas/shared";

interface UseCanvasFileActionsProps {
  board: { name: string };
  dimensions: { width: number; height: number };
  position: { x: number; y: number };
  scale: number;
  shapes: Shape[];
  user: { name: string };
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  stageRef: React.RefObject<any>;
  shapeManagerRef: React.RefObject<any>;
}

export default function useCanvasFileActions({
  board,
  dimensions,
  position,
  scale,
  shapes,
  user,
  fileInputRef,
  stageRef,
  shapeManagerRef,
}: UseCanvasFileActionsProps) {

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (!shapeManagerRef.current) return;
      const imgShape: Shape = {
        id: crypto.randomUUID(),
        type: 'image',
        src,
        x: -position.x / scale + dimensions.width / 2 / scale - 100, // rough center
        y: -position.y / scale + dimensions.height / 2 / scale - 100,
        width: 200,
        height: 200,
        rotation: 0,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        zIndex: shapes.length,
        createdBy: user.name,
        createdAt: Date.now(),
      } as any;
      shapeManagerRef.current.addShape(imgShape);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset
  };

  const handleClear = () => {
    if (!shapeManagerRef.current) return;
    const all = shapeManagerRef.current.getShapes();
    all.forEach((s: any) => shapeManagerRef.current?.deleteShape(s.id));
    if ((shapeManagerRef.current as any).undoManager) {
      (shapeManagerRef.current as any).undoManager.clear();
    }
  };

  const handleExport = (format: 'png' | 'pdf') => {
    if (!stageRef.current) return;
    const dataUrl = stageRef.current.toDataURL();
    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `${board.name}.png`;
      link.href = dataUrl;
      link.click();
    } else {
      const pdf = new jsPDF({
        orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [dimensions.width, dimensions.height],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, dimensions.width, dimensions.height);
      pdf.save(`${board.name}.pdf`);
    }
  };

  return {
    handleImageUpload,
    handleFileChange,
    handleClear,
    handleExport,
  };
}
