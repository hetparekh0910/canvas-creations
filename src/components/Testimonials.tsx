const testimonials = [
  {
    quote: "Canvas has transformed how our design team collaborates. The infinite canvas means we never run out of space for our crazy ideas.",
    author: "Sarah Chen",
    role: "Head of Design",
    company: "Stripe",
    avatar: "SC",
  },
  {
    quote: "The real-time multiplayer is incredible. It feels like we're all in the same room, even though we're spread across 12 time zones.",
    author: "Marcus Johnson",
    role: "Engineering Manager",
    company: "Airbnb",
    avatar: "MJ",
  },
  {
    quote: "We moved our entire product planning process to Canvas. The templates saved us weeks of setup time.",
    author: "Emily Rodriguez",
    role: "Product Lead",
    company: "Notion",
    avatar: "ER",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">teams</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what creative teams around the world are saying about Canvas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <p className="text-foreground leading-relaxed mb-6 text-lg">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
