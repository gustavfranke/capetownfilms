import { Instagram } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer style={{
      background: '#050505',
      borderTop: '1px solid #1a1a1a',
      padding: '3rem 2rem',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.15em', color: '#f0ede8', textTransform: 'uppercase' }}>
          Gustav Franke
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#portfolio" style={{ textDecoration: 'none' }} className="nav-link">Films</a>
          <a href="#about" style={{ textDecoration: 'none' }} className="nav-link">About</a>
          <a href="#contact" style={{ textDecoration: 'none' }} className="nav-link">Contact</a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(240,237,232,0.5)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,232,0.5)'}
          >
            <Instagram size={16} />
          </a>
        </div>

        <div style={{ fontSize: '0.7rem', color: 'rgba(240,237,232,0.3)', letterSpacing: '0.05em' }}>
          © 2025 Gustav Franke Cinematography
        </div>
      </div>
    </footer>
  );
}