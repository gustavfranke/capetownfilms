import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Nav from './Nav';
import StatsBar from './StatsBar';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import ContactSection from './ContactSection';
import FooterSection from './FooterSection';
import QuizModal from './QuizModal';

const bgImg = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80';

export default function FunnelPage({ slug }) {
  const [variant, setVariant] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    base44.entities.PageVariant.filter({ slug })
      .then(data => { if (data?.[0]) setVariant(data[0]); })
      .catch(() => {});
  }, [slug]);

  const headline = variant?.hero_headline || 'Your Love Story, Told in Cinema.';
  const subheadline = variant?.hero_subheadline || 'Cinematic wedding films for destination couples in Cape Town — and everywhere else worth going.';
  const ctaText = variant?.cta_text || 'Check My Availability';
  const badge = variant?.badge_text || 'Cape Town · Destination Wedding Films';

  return (
    <div style={{ background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <Nav onOpenQuiz={() => setQuizOpen(true)} />

      {/* Funnel hero */}
      <section className="grain-overlay" style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a',
        overflow: 'hidden',
      }}>
        <img
          src={bgImg}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.6), rgba(10,10,10,0.85))' }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '720px', padding: '0 2rem' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            {badge}
          </p>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 400, lineHeight: 1.15,
            color: '#f0ede8', marginBottom: '1.5rem',
          }}>
            {headline}
          </h1>
          <p style={{ color: 'rgba(240,237,232,0.65)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            {subheadline}
          </p>
          <button onClick={() => setQuizOpen(true)} className="btn-gold">{ctaText}</button>
        </div>
      </section>

      <StatsBar />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection onOpenQuiz={() => setQuizOpen(true)} />
      <FooterSection />
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  );
}