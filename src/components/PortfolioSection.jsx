import { useState } from 'react';
import { Play } from 'lucide-react';
import { useFadeInChildren } from '../hooks/useFadeIn';

const films = [
  { couple: 'Anika & James', venue: 'Babylonstoren', location: 'Franschhoek', img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80' },
  { couple: 'Sarah & Marcus', venue: 'Boschendal Estate', location: 'Stellenbosch', img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80' },
  { couple: 'Lena & Tom', venue: 'La Motte', location: 'Franschhoek', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80' },
  { couple: 'Nina & Carl', venue: 'Delaire Graff', location: 'Stellenbosch', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80' },
  { couple: 'Emily & Jake', venue: 'The Greenhouse', location: 'Cape Town', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80' },
  { couple: 'Mia & Leo', venue: 'Cascade Manor', location: 'Paarl', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80' },
];

export default function PortfolioSection({ onOpenQuiz }) {
  const [hovered, setHovered] = useState(null);
  const ref = useFadeInChildren(0.05);

  return (
    <section id="portfolio" style={{ background: '#080808', padding: '8rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Selected Work
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: '#f0ede8' }}>
            Films I'm Proud Of
          </h2>
        </div>

        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {films.map((film, i) => (
            <div
              key={i}
              className="fade-up"
              style={{ transitionDelay: `${i * 0.07}s` }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/10' }}>
                <img
                  src={film.img}
                  alt={film.couple}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.7s ease',
                    transform: hovered === i ? 'scale(1.05)' : 'scale(1)',
                    filter: 'grayscale(20%) contrast(1.1)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: hovered === i
                    ? 'rgba(10,10,10,0.55)'
                    : 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.1) 60%)',
                  transition: 'background 0.4s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }} >
                  {hovered === i && (
                    <div style={{
                      width: '54px', height: '54px',
                      border: '1px solid #c9a84c',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#c9a84c',
                    }}>
                      <Play size={20} fill="#c9a84c" />
                    </div>
                  )}
                </div>
                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', zIndex: 2 }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {film.venue} · {film.location}
                  </div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', color: '#f0ede8' }}>
                    {film.couple}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button onClick={onOpenQuiz} className="btn-outline-gold">
            Check My Availability
          </button>
        </div>
      </div>
    </section>
  );
}