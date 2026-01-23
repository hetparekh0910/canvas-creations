import { Maximize, Users, LayoutTemplate } from "lucide-react";

const features = [
  {
    icon: Maximize,
    title: "Infinite Zoom",
    description: "Zoom in for details, zoom out for the big picture. Your canvas grows with your ideas—no limits, no boundaries.",
  },
  {
    icon: Users,
    title: "Multiplayer by default",
    description: "See your team's cursors in real-time. Collaborate seamlessly whether you're in the same room or across the globe.",
  },
  {
    icon: LayoutTemplate,
    title: "100+ Templates",
    description: "Start with professionally designed templates for brainstorming, wireframing, project planning, and more.",
  },
];

const Features = () => {
  return (
    <section id="product" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">create</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools that feel intuitive. Built for teams who think visually.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
