import { Lightbulb, GitBranch, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Lightbulb,
    title: "Brainstorm",
    description: "Capture every idea with sticky notes, drawings, and mind maps. No idea is too wild.",
    color: "bg-sticky-yellow",
  },
  {
    number: "02",
    icon: GitBranch,
    title: "Structure",
    description: "Organize your thoughts into frameworks, flowcharts, and actionable plans.",
    color: "bg-sticky-blue",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Ship",
    description: "Export, share, and integrate with your favorite tools. Turn ideas into reality.",
    color: "bg-sticky-green",
  },
];

const Workflow = () => {
  return (
    <section id="solutions" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            From idea to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">execution</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple workflow that takes you from initial spark to shipped product.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
              )}
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center mb-6">
                  <div className={`w-24 h-24 rounded-2xl ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-10 h-10 text-hero" />
                  </div>
                </div>
                <div className="text-sm font-bold text-primary mb-2">{step.number}</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
