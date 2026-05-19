import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useFadeIn } from '../hooks/useFadeIn';

const fallback = [
  { quote: "Gustav captured moments we didn't even know were happening. Every time we watch our film, we cry. It's the most beautiful thing we own.", name: 'Lena & Tom', role: 'Married at La Motte', rating: 5 },
  { quote: "We flew from Amsterdam specifically to get married in Cape Town AND to have Gustav film it. Worth every rand, every flight, every choice.", name: 'Nina & Carl', role: 'Married at Delaire Graff', rating: 5 },
  { quote: "He was invisible on the day, but somehow he caught everything. The laugh my father did when he saw me in the dress. The way my husband looked at me.", name: 'Sarah & Marcus', role: 'Married at Boschendal', rating: 5 },
  { quote: "Documentary, cinematic, emotional. Gustav's film is the only thing from our wedding that gets better every time we see it.", name: 'Anika & James', role: 'Married at Babylonstoren', rating: 5 },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(fallback);
  const [current, setCurrent] = useState(0);
  const ref = useFadeIn(0.2);

  useEffect(() => {
    base44.entities.Testimonial.list('-created_date', 20)
      .then(data => { if (data?.length) setTestimonials(data); })
      .catch(() => {});
  }, []);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section style={{ background: '#0a0a0a', padding: '8rem 2rem' }}>
      <div ref={ref} className="fade-up" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '3rem' }}>
          What Couples Say
        </p>

        <div style={{ position: 'relative', minHeight: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '2rem' }}>
            {[...Array(t.rating || 5)].map((_, i) => (
              <Star key={i} size={14} fill="#c9a84c" color="#c9a84c" />
            ))}
          </div>

          <blockquote style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            lineHeight: 1.7,
            color: '#f0ede8',
            fontStyle: 'italic',
            marginBottom: '2.5rem',
          }}>
            "{t.quote || t.text || t.content}"
          </blockquote>

          <div style={{ color: '#f0ede8', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            {t.name || t.couple_name}
          </div>
          <div style={{ color: 'rgba(240,237,232,0.45)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            {t.role || t.venue || ''}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem' }}>
          <button onClick={prev} style={{
            background: 'none', border: '1px solid #1e1e1e', color: '#f0ede8',
            width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '24px' : '6px',
                  height: '2px',
                  background: i === current ? '#c9a84c' : '#333',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          <button onClick={next} style={{
            background: 'none', border: '1px solid #1e1e1e', color: '#f0ede8',
            width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}