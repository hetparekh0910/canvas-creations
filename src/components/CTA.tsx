import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 bg-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hero-foreground mb-6">
            Ready to bring your{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">ideas to life?</span>
          </h2>
          <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto">
            Join thousands of teams who've made Canvas their creative home. Start free, upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg" className="group text-lg px-8" onClick={() => navigate("/auth")}>
              Start Drawing — It's Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8" onClick={() => window.location.href = "mailto:sales@canvas.com"}>
              Talk to Sales
            </Button>
          </div>
          <p className="text-white/40 text-sm mt-6">
            No credit card required • Free forever for individuals
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
