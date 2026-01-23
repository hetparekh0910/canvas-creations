const integrations = [
  { name: "Slack", icon: "💬" },
  { name: "Notion", icon: "📝" },
  { name: "Figma", icon: "🎨" },
  { name: "Jira", icon: "📋" },
  { name: "GitHub", icon: "🐙" },
  { name: "Linear", icon: "⚡" },
  { name: "Zoom", icon: "🎥" },
  { name: "Google Drive", icon: "📁" },
];

const Integrations = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Works with your{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">stack</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect Canvas to the tools you already love. Seamless integrations, zero friction.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-3 px-6 py-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
            >
              <span className="text-2xl">{integration.icon}</span>
              <span className="font-medium text-foreground">{integration.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
