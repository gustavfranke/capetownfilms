import { useFadeInChildren } from '../hooks/useFadeIn';

const aboutImg = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80';

export default function AboutSection() {
  const ref = useFadeInChildren(0.1);

  return (
    <section id="about" style={{ background: '#0a0a0a', padding: '8rem 2rem' }}>
      <div
        ref={ref}
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '5rem',
          alignItems: 'center',
        }}
      >
        {/* Image */}
        <div className="fade-up" style={{ position: 'relative' }}>
          <img
            src={aboutImg}
            alt="Gustav Franke"
            style={{
              width: '100%',
              aspectRatio: '3/4',
              objectFit: 'cover',
              filter: 'grayscale(20%) contrast(1.05)',
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '-1.5rem',
            right: '-1.5rem',
            width: '60%',
            height: '60%',
            border: '1px solid rgba(201,168,76,0.25)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            left: '-1.5rem',
            padding: '0.75rem 1.25rem',
            background: '#c9a84c',
            color: '#0a0a0a',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Cape Town
          </div>
        </div>

        {/* Text */}
        <div className="fade-up fade-up-delay-2">
          <p style={{
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            color: '#c9a84c',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>About Gustav</p>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#f0ede8',
            marginBottom: '2rem',
          }}>
            I film a limited number<br />of weddings each year.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ color: 'rgba(240,237,232,0.7)', lineHeight: 1.8, fontSize: '1rem' }}>
              I'm Gustav Franke. I film a limited number of weddings each year because I believe every story deserves my full attention.
            </p>
            <p style={{ color: 'rgba(240,237,232,0.7)', lineHeight: 1.8, fontSize: '1rem' }}>
              I've filmed couples from Texas, Argentina, the UK, Amsterdam — all drawn to Cape Town for the same reason: it's unlike anywhere else. The mountains, the light, the ocean — it all ends up in the film.
            </p>
            <p style={{ color: 'rgba(240,237,232,0.7)', lineHeight: 1.8, fontSize: '1rem' }}>
              My style is documentary at heart, cinematic in execution. <strong style={{ color: '#f0ede8' }}>You'll forget I'm there. That's when the best shots happen.</strong>
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid #1e1e1e' }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.2rem',
              color: '#c9a84c',
              fontStyle: 'italic',
            }}>
              "The camera only shows what's real."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}