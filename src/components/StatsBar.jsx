import { useFadeIn } from '../hooks/useFadeIn';

const stats = [
  { value: '20', label: 'Weddings / Year' },
  { value: '30-Day', label: 'Delivery' },
  { value: '10+', label: 'Countries Filmed In' },
  { value: '2015', label: 'Since' },
];

export default function StatsBar() {
  const ref = useFadeIn(0.3);

  return (
    <section style={{ background: '#0f0f0f', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
      <div
        ref={ref}
        className="fade-up"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '3rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid #1e1e1e' : 'none',
              padding: '0 1rem',
            }}
          >
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2.2rem',
              color: '#c9a84c',
              fontWeight: 400,
              lineHeight: 1,
              marginBottom: '0.5rem',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(240,237,232,0.5)',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}