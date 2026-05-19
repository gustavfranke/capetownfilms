import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Copy, Eye, Trash2, X } from 'lucide-react';

const STATUS_COLORS = { live: '#4ade80', draft: '#c9a84c', archived: '#666' };

export default function QuizBuilderTab() {
  const [quizzes, setQuizzes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.Quiz.list('-created_date', 50).then(setQuizzes).catch(() => {});
  }, []);

  const createNew = async () => {
    const q = await base44.entities.Quiz.create({ title: 'New Quiz', slug: 'new-quiz-' + Date.now(), status: 'draft', questions: [] });
    setQuizzes(qs => [q, ...qs]);
    setEditing(q);
  };

  const copyQuiz = async (quiz) => {
    const copy = await base44.entities.Quiz.create({ ...quiz, title: quiz.title + ' (Copy)', status: 'draft', id: undefined, created_date: undefined });
    setQuizzes(qs => [copy, ...qs]);
  };

  const archiveQuiz = async (quiz) => {
    await base44.entities.Quiz.update(quiz.id, { status: 'archived' });
    setQuizzes(qs => qs.map(q => q.id === quiz.id ? { ...q, status: 'archived' } : q));
  };

  const saveEdit = async () => {
    setSaving(true);
    await base44.entities.Quiz.update(editing.id, editing);
    setQuizzes(qs => qs.map(q => q.id === editing.id ? editing : q));
    setSaving(false);
    setEditing(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#f0ede8' }}>Quiz Builder</h1>
        <button onClick={createNew} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
          <Plus size={14} /> New Quiz
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {quizzes.map(quiz => (
          <div key={quiz.id} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: '#f0ede8' }}>{quiz.title}</h3>
              <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', color: STATUS_COLORS[quiz.status] || '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {quiz.status || 'draft'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(240,237,232,0.4)', marginBottom: '1rem' }}>
              /{quiz.slug} · {quiz.total_responses || 0} responses
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => setEditing({ ...quiz })} style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(240,237,232,0.6)', padding: '0.35rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Edit size={12} /> Edit
              </button>
              <button onClick={() => copyQuiz(quiz)} style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(240,237,232,0.6)', padding: '0.35rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Copy size={12} /> Copy
              </button>
              <a href={`/${quiz.slug}`} target="_blank" rel="noopener noreferrer" style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(240,237,232,0.6)', padding: '0.35rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <Eye size={12} /> View
              </a>
              <button onClick={() => archiveQuiz(quiz)} style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(239,68,68,0.5)', padding: '0.35rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Trash2 size={12} /> Archive
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit panel */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setEditing(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '500px', maxWidth: '95vw', background: '#0f0f0f', borderLeft: '1px solid #1a1a1a', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#f0ede8' }}>Edit Quiz</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[['Title', 'title', 'text'], ['Slug / URL path', 'slug', 'text']].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                <input type={type} value={editing[key] || ''} onChange={e => setEditing(q => ({ ...q, [key]: e.target.value }))}
                  style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none' }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Status</label>
              <select value={editing.status || 'draft'} onChange={e => setEditing(q => ({ ...q, status: e.target.value }))}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', outline: 'none' }}>
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Completion Headline</label>
              <input value={editing.completion_headline || ''} onChange={e => setEditing(q => ({ ...q, completion_headline: e.target.value }))}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            <button onClick={saveEdit} disabled={saving} className="btn-gold" style={{ width: '100%' }}>{saving ? 'Saving...' : 'Save Quiz'}</button>
          </div>
        </div>
      )}
    </div>
  );
}