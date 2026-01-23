import { cn } from "@/lib/utils";

interface StickyNoteProps {
  color: "yellow" | "pink" | "blue" | "green" | "purple";
  children: React.ReactNode;
  className?: string;
  rotation?: number;
}

const colorClasses = {
  yellow: "bg-sticky-yellow",
  pink: "bg-sticky-pink",
  blue: "bg-sticky-blue",
  green: "bg-sticky-green",
  purple: "bg-sticky-purple",
};

const StickyNote = ({ color, children, className, rotation = 0 }: StickyNoteProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-sm shadow-lg",
        colorClasses[color],
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <p className="text-hero font-medium text-sm leading-relaxed">{children}</p>
    </div>
  );
};

export default StickyNote;
