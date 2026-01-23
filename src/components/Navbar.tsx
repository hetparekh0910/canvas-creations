import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Product", href: "#product" },
    { label: "Solutions", href: "#solutions" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-hero/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-hero-foreground">Canvas</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              Log in
            </Button>
            <Button variant="gradient" size="default">
              Start Drawing
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 justify-start">
                  Log in
                </Button>
                <Button variant="gradient">
                  Start Drawing
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
