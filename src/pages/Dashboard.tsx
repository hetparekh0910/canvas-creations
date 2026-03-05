import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Trash2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Drawing {
  id: string;
  title: string;
  elements: any[];
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loadingDrawings, setLoadingDrawings] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchDrawings = async () => {
      const { data, error } = await supabase
        .from("drawings")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        toast({ title: "Error loading drawings", description: error.message, variant: "destructive" });
      } else {
        setDrawings((data as unknown as Drawing[]) || []);
      }
      setLoadingDrawings(false);
    };
    fetchDrawings();
  }, [user]);

  const createNewDrawing = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("drawings")
      .insert({ user_id: user.id, title: "Untitled", elements: [] })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      navigate(`/canvas/${data.id}`);
    }
  };

  const deleteDrawing = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("drawings").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setDrawings((prev) => prev.filter((d) => d.id !== id));
      toast({ title: "Drawing deleted" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-hero flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero">
      {/* Background blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-hero-foreground">Canvas</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-hero-foreground">My Drawings</h1>
            <p className="text-white/50 mt-1">Create and manage your canvas drawings</p>
          </div>
          <Button variant="gradient" onClick={createNewDrawing}>
            <Plus size={18} />
            New Drawing
          </Button>
        </div>

        {loadingDrawings ? (
          <div className="text-white/50 text-center py-20">Loading drawings...</div>
        ) : drawings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-hero-foreground mb-2">No drawings yet</h2>
            <p className="text-white/50 mb-6">Create your first drawing to get started</p>
            <Button variant="gradient" onClick={createNewDrawing}>
              <Plus size={18} />
              Create Drawing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* New drawing card */}
            <button
              onClick={createNewDrawing}
              className="group border-2 border-dashed border-white/15 rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-primary/50 hover:bg-white/5 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-3">
                <Plus size={24} className="text-white/50 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-white/50 group-hover:text-white/80 font-medium transition-colors">New Drawing</span>
            </button>

            {/* Drawing cards */}
            {drawings.map((drawing) => (
              <DrawingCard
                key={drawing.id}
                drawing={drawing}
                onClick={() => navigate(`/canvas/${drawing.id}`)}
                onDelete={(e) => deleteDrawing(drawing.id, e)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

function DrawingCard({
  drawing,
  onClick,
  onDelete,
}: {
  drawing: Drawing;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const elementCount = Array.isArray(drawing.elements) ? drawing.elements.length : 0;
  const updatedAt = new Date(drawing.updated_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/40 hover:bg-white/[0.07] transition-all text-left"
    >
      {/* Thumbnail area */}
      <div className="relative h-36 bg-[hsl(232,40%,12%)] overflow-hidden">
        <DrawingThumbnail elements={drawing.elements} />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onDelete}
            className="p-1.5 bg-destructive/80 hover:bg-destructive text-white rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-hero-foreground truncate">{drawing.title}</h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {updatedAt}
          </span>
          <span>{elementCount} element{elementCount !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </button>
  );
}

function DrawingThumbnail({ elements }: { elements: any }) {
  if (!Array.isArray(elements) || elements.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-white/15 text-sm">Empty canvas</span>
      </div>
    );
  }

  // Render a simple SVG preview of the elements
  // Find bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const el of elements) {
    const ex = el.x ?? 0, ey = el.y ?? 0;
    const ew = el.width ?? 0, eh = el.height ?? 0;
    minX = Math.min(minX, ex, ex + ew);
    minY = Math.min(minY, ey, ey + eh);
    maxX = Math.max(maxX, ex, ex + ew);
    maxY = Math.max(maxY, ey, ey + eh);
    if (el.points) {
      for (const p of el.points) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
    }
  }

  const padding = 20;
  const vbW = Math.max(maxX - minX + padding * 2, 1);
  const vbH = Math.max(maxY - minY + padding * 2, 1);
  const vbX = minX - padding;
  const vbY = minY - padding;

  return (
    <svg
      className="w-full h-full"
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {elements.map((el: any, i: number) => {
        const color = el.color || "white";
        const sw = el.strokeWidth || 2;
        switch (el.type) {
          case "rectangle":
            return <rect key={i} x={el.x} y={el.y} width={el.width} height={el.height} stroke={color} strokeWidth={sw} fill={color + "20"} />;
          case "circle":
            return <ellipse key={i} cx={el.x + el.width / 2} cy={el.y + el.height / 2} rx={Math.abs(el.width) / 2} ry={Math.abs(el.height) / 2} stroke={color} strokeWidth={sw} fill={color + "20"} />;
          case "diamond": {
            const cx = el.x + el.width / 2, cy = el.y + el.height / 2;
            return <polygon key={i} points={`${cx},${el.y} ${el.x + el.width},${cy} ${cx},${el.y + el.height} ${el.x},${cy}`} stroke={color} strokeWidth={sw} fill={color + "20"} />;
          }
          case "line":
            return <line key={i} x1={el.x} y1={el.y} x2={el.x + el.width} y2={el.y + el.height} stroke={color} strokeWidth={sw} />;
          case "arrow":
            return <line key={i} x1={el.x} y1={el.y} x2={el.x + el.width} y2={el.y + el.height} stroke={color} strokeWidth={sw} />;
          case "pencil":
            if (el.points?.length > 1) {
              const d = el.points.map((p: any, j: number) => `${j === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
              return <path key={i} d={d} stroke={color} strokeWidth={sw} fill="none" />;
            }
            return null;
          case "text":
            return <text key={i} x={el.x} y={el.y + 16} fill={color} fontSize={14}>{el.text}</text>;
          default:
            return null;
        }
      })}
    </svg>
  );
}

export default Dashboard;
