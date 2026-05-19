import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Nav({ onOpenQuiz }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1.25rem 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 0.4s ease, padding 0.4s ease',
        background: scrolled ? 'rgba(10,10,10,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
      }}
    >
      {/* Logo */}
      <a href="/" style={{ textDecoration: 'none' }}>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.05rem',
          letterSpacing: '0.2em',
          color: '#f0ede8',
          fontWeight: 400,
          textTransform: 'uppercase',
        }}>
          Gustav Franke
        </div>
      </a>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        <button onClick={() => scrollTo('portfolio')} className="nav-link bg-transparent">Films</button>
        <button onClick={() => scrollTo('about')} className="nav-link bg-transparent">About</button>
        <button onClick={() => scrollTo('contact')} className="nav-link bg-transparent">Contact</button>
        <button onClick={onOpenQuiz} className="btn-gold" style={{ fontSize: '0.7rem' }}>
          Check Availability
        </button>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ color: '#f0ede8', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(10,10,10,0.98)',
          padding: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
        }}>
          <button onClick={() => scrollTo('portfolio')} className="nav-link bg-transparent text-left">Films</button>
          <button onClick={() => scrollTo('about')} className="nav-link bg-transparent text-left">About</button>
          <button onClick={() => scrollTo('contact')} className="nav-link bg-transparent text-left">Contact</button>
          <button onClick={() => { setMenuOpen(false); onOpenQuiz(); }} className="btn-gold w-full">
            Check Availability
          </button>
        </div>
      )}
    </nav>
  );
}