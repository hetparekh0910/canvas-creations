import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  MousePointer2, Square, Circle, Minus, Type, Pencil,
  Undo2, Redo2, ZoomIn, ZoomOut, LogOut, Save, Trash2,
  Diamond, ArrowRight,
} from "lucide-react";

type Tool = "select" | "rectangle" | "circle" | "line" | "text" | "pencil" | "diamond" | "arrow";

interface CanvasElement {
  id: string;
  type: Tool;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: { x: number; y: number }[];
  text?: string;
  color: string;
  strokeWidth: number;
}

const COLORS = [
  "hsl(258, 90%, 62%)",
  "hsl(186, 90%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(48, 100%, 67%)",
  "hsl(142, 69%, 58%)",
  "hsl(0, 0%, 100%)",
];

const Canvas = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<CanvasElement | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drawingId, setDrawingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  // Load or create drawing
  useEffect(() => {
    if (!user) return;
    const loadDrawing = async () => {
      const { data } = await supabase
        .from("drawings")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setDrawingId(data[0].id);
        const els = (data[0].elements as unknown as CanvasElement[]) || [];
        setElements(els);
        setHistory([els]);
        setHistoryIndex(0);
      } else {
        const { data: newDrawing } = await supabase
          .from("drawings")
          .insert({ user_id: user.id, title: "My Canvas", elements: [] })
          .select()
          .single();
        if (newDrawing) setDrawingId(newDrawing.id);
      }
    };
    loadDrawing();
  }, [user]);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Background
    ctx.fillStyle = "hsl(232, 40%, 8%)";
    ctx.fillRect(-pan.x / zoom, -pan.y / zoom, canvas.width / zoom, canvas.height / zoom);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    const startX = Math.floor(-pan.x / zoom / gridSize) * gridSize;
    const startY = Math.floor(-pan.y / zoom / gridSize) * gridSize;
    const endX = startX + canvas.width / zoom + gridSize;
    const endY = startY + canvas.height / zoom + gridSize;

    for (let x = startX; x < endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }
    for (let y = startY; y < endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }

    // Draw elements
    const allElements = currentElement ? [...elements, currentElement] : elements;
    for (const el of allElements) {
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color + "20";
      ctx.lineWidth = el.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      switch (el.type) {
        case "rectangle":
          ctx.beginPath();
          ctx.rect(el.x, el.y, el.width, el.height);
          ctx.fill();
          ctx.stroke();
          break;
        case "circle":
          ctx.beginPath();
          const rx = Math.abs(el.width) / 2;
          const ry = Math.abs(el.height) / 2;
          ctx.ellipse(el.x + el.width / 2, el.y + el.height / 2, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case "diamond":
          ctx.beginPath();
          const cx = el.x + el.width / 2;
          const cy = el.y + el.height / 2;
          ctx.moveTo(cx, el.y);
          ctx.lineTo(el.x + el.width, cy);
          ctx.lineTo(cx, el.y + el.height);
          ctx.lineTo(el.x, cy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case "line":
          ctx.beginPath();
          ctx.moveTo(el.x, el.y);
          ctx.lineTo(el.x + el.width, el.y + el.height);
          ctx.stroke();
          break;
        case "arrow":
          ctx.beginPath();
          ctx.moveTo(el.x, el.y);
          ctx.lineTo(el.x + el.width, el.y + el.height);
          ctx.stroke();
          // Arrowhead
          const angle = Math.atan2(el.height, el.width);
          const headLen = 15;
          ctx.beginPath();
          ctx.moveTo(el.x + el.width, el.y + el.height);
          ctx.lineTo(
            el.x + el.width - headLen * Math.cos(angle - Math.PI / 6),
            el.y + el.height - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(el.x + el.width, el.y + el.height);
          ctx.lineTo(
            el.x + el.width - headLen * Math.cos(angle + Math.PI / 6),
            el.y + el.height - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
          break;
        case "pencil":
          if (el.points && el.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(el.points[0].x, el.points[0].y);
            for (let i = 1; i < el.points.length; i++) {
              ctx.lineTo(el.points[i].x, el.points[i].y);
            }
            ctx.stroke();
          }
          break;
        case "text":
          ctx.font = "16px Inter, sans-serif";
          ctx.fillStyle = el.color;
          ctx.fillText(el.text || "Text", el.x, el.y + 16);
          break;
      }
    }
    ctx.restore();
  }, [elements, currentElement, zoom, pan]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const getCanvasPoint = (e: React.MouseEvent) => ({
    x: (e.clientX - pan.x) / zoom,
    y: (e.clientY - pan.y) / zoom,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === "select") return;
    const point = getCanvasPoint(e);
    setIsDrawing(true);

    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const newEl: CanvasElement = {
          id: crypto.randomUUID(),
          type: "text",
          x: point.x,
          y: point.y,
          width: 0,
          height: 0,
          text,
          color,
          strokeWidth: 2,
        };
        const newElements = [...elements, newEl];
        setElements(newElements);
        pushHistory(newElements);
      }
      return;
    }

    const newEl: CanvasElement = {
      id: crypto.randomUUID(),
      type: tool,
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      points: tool === "pencil" ? [{ x: point.x, y: point.y }] : undefined,
      color,
      strokeWidth: 2,
    };
    setCurrentElement(newEl);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentElement) return;
    const point = getCanvasPoint(e);

    if (currentElement.type === "pencil") {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), { x: point.x, y: point.y }],
      });
    } else {
      setCurrentElement({
        ...currentElement,
        width: point.x - currentElement.x,
        height: point.y - currentElement.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentElement) return;
    setIsDrawing(false);
    const newElements = [...elements, currentElement];
    setElements(newElements);
    setCurrentElement(null);
    pushHistory(newElements);
  };

  const pushHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  const save = async () => {
    if (!drawingId) return;
    setSaving(true);
    await supabase
      .from("drawings")
      .update({ elements: JSON.parse(JSON.stringify(elements)) })
      .eq("id", drawingId);
    setSaving(false);
  };

  const clearCanvas = () => {
    setElements([]);
    pushHistory([]);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const tools: { tool: Tool; icon: React.ReactNode; label: string }[] = [
    { tool: "select", icon: <MousePointer2 size={18} />, label: "Select" },
    { tool: "rectangle", icon: <Square size={18} />, label: "Rectangle" },
    { tool: "circle", icon: <Circle size={18} />, label: "Circle" },
    { tool: "diamond", icon: <Diamond size={18} />, label: "Diamond" },
    { tool: "line", icon: <Minus size={18} />, label: "Line" },
    { tool: "arrow", icon: <ArrowRight size={18} />, label: "Arrow" },
    { tool: "pencil", icon: <Pencil size={18} />, label: "Draw" },
    { tool: "text", icon: <Type size={18} />, label: "Text" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-hero flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-hero">
      {/* Top toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-1.5">
        {tools.map((t) => (
          <button
            key={t.tool}
            onClick={() => setTool(t.tool)}
            title={t.label}
            className={`p-2.5 rounded-lg transition-colors ${
              tool === t.tool
                ? "bg-primary text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.icon}
          </button>
        ))}
        <div className="w-px h-6 bg-white/20 mx-1" />
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full border-2 transition-transform ${
              color === c ? "border-white scale-125" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Left actions */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-1.5">
          <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="text-white font-semibold text-sm pr-2">Canvas</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-1.5">
          <button onClick={undo} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10" title="Undo">
            <Undo2 size={18} />
          </button>
          <button onClick={redo} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10" title="Redo">
            <Redo2 size={18} />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button onClick={() => setZoom(Math.min(zoom + 0.1, 3))} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10" title="Zoom In">
            <ZoomIn size={18} />
          </button>
          <span className="text-white/60 text-xs min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.2))} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10" title="Zoom Out">
            <ZoomOut size={18} />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button onClick={clearCanvas} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10" title="Clear Canvas">
            <Trash2 size={18} />
          </button>
          <Button variant="gradient" size="sm" onClick={save} disabled={saving}>
            <Save size={14} />
            {saving ? "Saving..." : "Save"}
          </Button>
          <button onClick={handleSignOut} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10" title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => {
          if (e.ctrlKey) {
            e.preventDefault();
            setZoom(Math.max(0.2, Math.min(3, zoom - e.deltaY * 0.001)));
          } else {
            setPan({ x: pan.x - e.deltaX, y: pan.y - e.deltaY });
          }
        }}
      />
    </div>
  );
};

export default Canvas;
