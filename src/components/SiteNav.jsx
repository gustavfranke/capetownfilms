import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Films", href: "/films" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none group">
            <span
              className="text-white text-xl font-normal tracking-widest uppercase group-hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Gustav Franke
            </span>
            <span className="text-white/40 text-[9px] tracking-[0.35em] uppercase mt-0.5">
              Cinematography
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white/70 hover:text-white text-sm tracking-wide transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book-me"
              className="text-sm tracking-wide px-5 py-2 rounded border transition-all hover:bg-[#c9a84c] hover:text-black"
              style={{ borderColor: "#c9a84c", color: "#c9a84c" }}
            >
              Book Me
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-20 px-6 pb-8"
          style={{ background: "rgba(10,10,10,0.98)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex flex-col gap-6 mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white text-2xl font-light tracking-wide border-b border-white/10 pb-4"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book-me"
              className="text-center text-lg tracking-wide px-6 py-4 rounded border mt-2 transition-all"
              style={{ borderColor: "#c9a84c", color: "#c9a84c" }}
            >
              Book Me
            </Link>
          </div>
        </div>
      )}
    </>
  );
}