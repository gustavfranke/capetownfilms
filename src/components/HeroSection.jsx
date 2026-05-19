import { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

const heroImg = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80';

export default function HeroSection({ onOpenQuiz }) {
  const textRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textRef.current) textRef.current.classList.add('visible');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToPortfolio = () => {
    const el = document.getElementById('portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="grain-overlay"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      {/* Cinematic background image */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img
          src={heroImg}
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 0.38,
            filter: 'grayscale(15%) contrast(1.1)',
          }}
        />
      </div>

      {/* Dark overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.9) 100%)',
      }} />

      {/* Gold line from top */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '1px', height: '80px',
        background: 'linear-gradient(to bottom, transparent, #c9a84c)',
        zIndex: 2,
      }} />

      {/* Content */}
      <div
        ref={textRef}
        className="fade-up"
        style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '0 2rem',
        }}
      >
        <p style={{
          fontSize: '0.7rem',
          letterSpacing: '0.35em',
          color: '#c9a84c',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
        }}>
          Cape Town · Destination Wedding Films
        </p>

        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 400,
          lineHeight: 1.1,
          color: '#f0ede8',
          marginBottom: '1.5rem',
          letterSpacing: '-0.01em',
        }}>
          Your Love Story,<br />
          <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Told in Cinema.</em>
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'rgba(240,237,232,0.7)',
          lineHeight: 1.7,
          maxWidth: '560px',
          margin: '0 auto 3rem',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
        }}>
          Cinematic wedding films for destination couples in Cape Town — and everywhere else worth going.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onOpenQuiz} className="btn-gold">
            Check My Availability
          </button>
          <button onClick={scrollToPortfolio} className="btn-outline-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Play size={14} fill="currentColor" />
            Watch My Films
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(240,237,232,0.35)', textTransform: 'uppercase' }}>Scroll</p>
        <div style={{
          width: '1px', height: '50px',
          background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)',
        }} />
      </div>
    </section>
  );
}