import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useFadeInChildren } from '../hooks/useFadeIn';

const fallbackFAQs = [
  { question: 'How far in advance should I book?', answer: "I film only 20 weddings per year, and most dates are booked 12–18 months in advance. If you have a date in mind, reach out as soon as possible. I'd hate to miss your wedding because someone else was quicker." },
  { question: 'Do you travel internationally?', answer: "Absolutely. I've filmed in Argentina, the UK, the Netherlands, Texas, and many more. Cape Town is my home base, but the best stories take me wherever they happen. Travel costs are discussed openly — no surprises." },
  { question: 'How long until we receive our film?', answer: "Your highlight film is delivered within 30 days of your wedding. I don't believe in making you wait months. Your story deserves to be told while the memory is still fresh." },
  { question: 'What does your filming style look like?', answer: "Documentary at heart, cinematic in execution. I don't direct moments — I observe them. Your film will look like a short feature film, not a wedding video. Think natural light, real moments, emotional music." },
  { question: 'What packages do you offer?', answer: "I offer a few carefully designed packages starting with the highlight film. I prefer to talk through what you actually need rather than sell you a package you don't. Fill in the availability form and we'll have a proper conversation." },
  { question: 'Do we need to feed the crew?', answer: "Yes — it's a long day and a well-fed filmmaker is a focused filmmaker. A vendor meal goes a long way. Most venues already include this, but it's worth checking." },
];

export default function FAQSection() {
  const [faqs, setFaqs] = useState(fallbackFAQs);
  const [open, setOpen] = useState(null);
  const ref = useFadeInChildren(0.05);

  useEffect(() => {
    base44.entities.FAQ.list('sort_order', 30)
      .then(data => { if (data?.length) setFaqs(data); })
      .catch(() => {});
  }, []);

  return (
    <section style={{ background: '#080808', padding: '8rem 2rem' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '1rem' }}>Questions</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 400, color: '#f0ede8' }}>
            Things People Ask
          </h2>
        </div>

        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="fade-up"
              style={{ transitionDelay: `${i * 0.05}s`, borderBottom: '1px solid #1a1a1a' }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: 'none', border: 'none',
                  cursor: 'pointer',
                  padding: '1.5rem 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                }}
              >
                <span style={{
                  fontSize: '1rem',
                  color: open === i ? '#c9a84c' : '#f0ede8',
                  fontFamily: 'Georgia, serif',
                  transition: 'color 0.2s',
                }}>
                  {faq.question}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    color: '#c9a84c', flexShrink: 0,
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </button>

              <div style={{
                maxHeight: open === i ? '400px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease',
              }}>
                <p style={{
                  color: 'rgba(240,237,232,0.65)',
                  lineHeight: 1.8,
                  fontSize: '0.95rem',
                  paddingBottom: '1.5rem',
                }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}