import { useState, useEffect } from 'react';
import { X, ChevronLeft, Loader2, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const defaultQuestions = [
  {
    id: 'q1', type: 'single_select',
    question: 'When is your wedding?',
    options: [
      { emoji: '📅', label: 'Within 6 months' },
      { emoji: '🗓', label: '6–12 months away' },
      { emoji: '✨', label: '1–2 years away' },
      { emoji: '💭', label: 'Still planning' },
    ],
  },
  {
    id: 'q2', type: 'single_select',
    question: 'Where are you getting married?',
    options: [
      { emoji: '🏔', label: 'Cape Town / Winelands' },
      { emoji: '🌍', label: 'Elsewhere in South Africa' },
      { emoji: '✈️', label: 'Destination – International' },
      { emoji: '🤔', label: 'Haven\'t decided yet' },
    ],
  },
  {
    id: 'q3', type: 'single_select',
    question: 'How did you hear about me?',
    options: [
      { emoji: '📸', label: 'Instagram' },
      { emoji: '🔍', label: 'Google' },
      { emoji: '💬', label: 'A friend / referral' },
      { emoji: '🎬', label: 'Saw your films online' },
    ],
  },
  {
    id: 'q4', type: 'single_select',
    question: 'What matters most to you in a wedding film?',
    options: [
      { emoji: '😢', label: 'Emotional moments' },
      { emoji: '🎥', label: 'Cinematic visuals' },
      { emoji: '💃', label: 'Fun & energy' },
      { emoji: '📖', label: 'Telling our story' },
    ],
  },
  { id: 'contact', type: 'contact_step' },
];

export default function QuizModal({ isOpen, onClose }) {
  const [questions, setQuestions] = useState(defaultQuestions);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: '', email: '', phone: '', wedding_date: '', venue: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    base44.entities.SurveyConfig.filter({ config_key: 'default' })
      .then(data => {
        if (data?.[0]?.questions?.length) setQuestions([...data[0].questions, { id: 'contact', type: 'contact_step' }]);
      })
      .catch(() => {});
    setStep(0); setAnswers({}); setSubmitted(false);
    setContact({ name: '', email: '', phone: '', wedding_date: '', venue: '', message: '' });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const q = questions[step];
  const total = questions.length;
  const progress = ((step) / (total - 1)) * 100;

  const selectOption = (label) => {
    setAnswers(a => ({ ...a, [q.id]: label }));
    setDirection(1);
    setTimeout(() => setStep(s => s + 1), 250);
  };

  const goBack = () => { setDirection(-1); setStep(s => Math.max(0, s - 1)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.Lead.create({
        ...contact,
        survey_answers: answers,
        funnel_variant: 'home',
        status: 'new',
        survey_completed: true,
      });
      await base44.entities.SurveyResponse.create({
        answers: answers,
        contact_name: contact.name,
        contact_email: contact.email,
        source: 'home',
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'none', border: '1px solid #1e1e1e',
          color: '#f0ede8', cursor: 'pointer',
          width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
      >
        <X size={16} />
      </button>

      {submitted ? (
        /* Thank you */
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{
            width: '60px', height: '60px', border: '1px solid #c9a84c',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem', color: '#c9a84c',
          }}>
            <Check size={24} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#f0ede8', marginBottom: '1rem' }}>
            You're on my radar!
          </h2>
          <p style={{ color: 'rgba(240,237,232,0.6)', lineHeight: 1.8, marginBottom: '2rem' }}>
            I've received your message and will personally get back to you within 24 hours. In the meantime, browse some of my recent films.
          </p>
          <button onClick={onClose} className="btn-gold">Close</button>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '620px' }}>
          {/* Progress */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase' }}>
                {q?.type === 'contact_step' ? 'Almost there' : `Step ${step + 1} of ${total - 1}`}
              </span>
              {step > 0 && (
                <button onClick={goBack} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.4)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronLeft size={14} /> Back
                </button>
              )}
            </div>
            <div style={{ height: '1px', background: '#1a1a1a', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '1px', background: '#c9a84c', width: `${progress}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {q?.type === 'contact_step' ? (
            /* Contact form */
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#f0ede8', marginBottom: '0.5rem' }}>
                Let's connect.
              </h2>
              <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                I respond personally within 24 hours.
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                {[
                  { key: 'name', label: 'Your Name', type: 'text', required: true, span: 1 },
                  { key: 'email', label: 'Email Address', type: 'email', required: true, span: 1 },
                  { key: 'phone', label: 'Phone Number', type: 'tel', span: 1 },
                  { key: 'wedding_date', label: 'Wedding Date', type: 'date', span: 1 },
                  { key: 'venue', label: 'Venue / Location', type: 'text', span: 2 },
                  { key: 'message', label: 'Anything else?', type: 'textarea', span: 2 },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: `span ${f.span}` }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.5)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      {f.label}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={contact[f.key]}
                        onChange={e => setContact(c => ({ ...c, [f.key]: e.target.value }))}
                        rows={3}
                        style={{
                          width: '100%', background: '#111', border: '1px solid #1e1e1e',
                          color: '#f0ede8', padding: '0.75rem', fontSize: '0.95rem',
                          outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                        }}
                      />
                    ) : (
                      <input
                        type={f.type}
                        required={f.required}
                        value={contact[f.key]}
                        onChange={e => setContact(c => ({ ...c, [f.key]: e.target.value }))}
                        style={{
                          width: '100%', background: '#111', border: '1px solid #1e1e1e',
                          color: '#f0ede8', padding: '0.75rem', fontSize: '0.95rem', outline: 'none',
                        }}
                      />
                    )}
                  </div>
                ))}
                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" className="btn-gold w-full" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={submitting}>
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {submitting ? 'Sending...' : 'Check My Availability'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Question */
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#f0ede8', marginBottom: '2.5rem', lineHeight: 1.3 }}>
                {q?.question}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {q?.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectOption(opt.label)}
                    style={{
                      background: answers[q.id] === opt.label ? 'rgba(201,168,76,0.15)' : '#0f0f0f',
                      border: answers[q.id] === opt.label ? '1px solid #c9a84c' : '1px solid #1e1e1e',
                      color: '#f0ede8',
                      padding: '1.25rem 1.5rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}
                    onMouseEnter={e => { if (answers[q.id] !== opt.label) e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; }}
                    onMouseLeave={e => { if (answers[q.id] !== opt.label) e.currentTarget.style.borderColor = '#1e1e1e'; }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{opt.emoji}</span>
                    <span style={{ fontSize: '0.9rem' }}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}