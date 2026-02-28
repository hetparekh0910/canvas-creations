import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import StickyNote from "./StickyNote";
import DemoModal from "./DemoModal";

const Hero = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-hero overflow-hidden pt-20">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/30 rounded-full blur-[128px]" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-160px)]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Now with AI-powered features
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-hero-foreground leading-tight">
              Where ideas{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                flow freely
              </span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-lg leading-relaxed">
              The infinite whiteboard for creative teams. Brainstorm, plan, and bring your ideas to life with unlimited space and powerful collaboration tools.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="gradient" size="lg" className="group" onClick={() => navigate("/auth")}>
                Start Drawing
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" onClick={() => setDemoOpen(true)}>
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-primary border-2 border-hero flex items-center justify-center text-white text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-white/60 text-sm">
                <span className="text-white font-semibold">10,000+</span> teams already creating
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Whiteboard Preview */}
          <div className="relative lg:h-[600px] hidden lg:block">
            {/* Whiteboard Container */}
            <div className="absolute inset-0 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
              {/* Grid */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              
              {/* Floating Sticky Notes */}
              <div className="absolute top-12 left-8 animate-float">
                <StickyNote color="yellow" rotation={-3} className="w-40">
                  Brainstorm new features ✨
                </StickyNote>
              </div>
              
              <div className="absolute top-32 right-12 animate-float-delayed">
                <StickyNote color="pink" rotation={5} className="w-36">
                  User research insights
                </StickyNote>
              </div>
              
              <div className="absolute bottom-40 left-16 animate-float">
                <StickyNote color="blue" rotation={-2} className="w-44">
                  Q4 roadmap planning 🎯
                </StickyNote>
              </div>
              
              <div className="absolute bottom-24 right-20 animate-float-delayed">
                <StickyNote color="green" rotation={4} className="w-40">
                  Ship by Friday! 🚀
                </StickyNote>
              </div>

              <div className="absolute top-1/2 left-1/3 animate-float">
                <StickyNote color="purple" rotation={-1} className="w-38">
                  Design review notes
                </StickyNote>
              </div>

              {/* Cursor indicators */}
              <div className="absolute top-20 right-32 flex items-center gap-2">
                <div className="w-4 h-4 bg-accent rounded-full animate-pulse" />
                <span className="text-xs text-white/60 bg-hero/80 px-2 py-1 rounded">Sarah</span>
              </div>
              <div className="absolute bottom-48 left-32 flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-white/60 bg-hero/80 px-2 py-1 rounded">Mike</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </section>
  );
};

export default Hero;
