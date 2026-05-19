import { useFadeIn } from '../hooks/useFadeIn';

export default function ContactSection({ onOpenQuiz }) {
  const ref = useFadeIn(0.2);

  return (
    <section
      id="contact"
      className="grain-overlay"
      style={{
        background: '#0f0f0f',
        padding: '10rem 2rem',
        position: 'relative',
        textAlign: 'center',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      {/* Gold horizontal line */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80px', height: '1px', background: '#c9a84c',
      }} />

      <div ref={ref} className="fade-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Let's Begin
        </p>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          fontWeight: 400,
          color: '#f0ede8',
          lineHeight: 1.2,
          marginBottom: '1.5rem',
        }}>
          Your date might<br />
          <em style={{ color: '#c9a84c' }}>still be open.</em>
        </h2>
        <p style={{ color: 'rgba(240,237,232,0.6)', lineHeight: 1.8, marginBottom: '3rem', fontSize: '1rem' }}>
          I respond to every inquiry personally within 24 hours. Tell me about your wedding and we'll figure out the rest.
        </p>
        <button onClick={onOpenQuiz} className="btn-gold" style={{ fontSize: '0.8rem' }}>
          Check My Availability
        </button>
      </div>
    </section>
  );
}