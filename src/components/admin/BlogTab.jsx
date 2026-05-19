import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, X } from 'lucide-react';

const STATUS_FLOW = ['draft', 'needs_humanize', 'humanized', 'published'];
const STATUS_COLORS = { draft: '#666', needs_humanize: '#c9a84c', humanized: '#60a5fa', published: '#4ade80' };

export default function BlogTab() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { base44.entities.BlogPost.list('-created_date', 50).then(setPosts).catch(() => {}); }, []);

  const save = async () => {
    setSaving(true);
    if (editing.id) {
      await base44.entities.BlogPost.update(editing.id, editing);
      setPosts(ps => ps.map(p => p.id === editing.id ? editing : p));
    } else {
      const created = await base44.entities.BlogPost.create({ ...editing, status: 'draft' });
      setPosts(ps => [created, ...ps]);
    }
    setSaving(false); setEditing(null);
  };

  const advanceStatus = async (post) => {
    const idx = STATUS_FLOW.indexOf(post.status || 'draft');
    const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
    await base44.entities.BlogPost.update(post.id, { status: next });
    setPosts(ps => ps.map(p => p.id === post.id ? { ...p, status: next } : p));
  };

  const blank = { title: '', slug: '', excerpt: '', body: '', focus_keyword: '', status: 'draft' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#f0ede8' }}>Blog</h1>
        <button onClick={() => setEditing(blank)} className="btn-gold" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={14} /> New Post
        </button>
      </div>

      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
              {['Title', 'Slug', 'Focus Keyword', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'rgba(240,237,232,0.4)', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>No posts yet</td></tr>}
            {posts.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '0.85rem 1rem', color: '#f0ede8', fontFamily: 'Georgia, serif' }}>{p.title}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'rgba(240,237,232,0.5)', fontSize: '0.8rem' }}>{p.slug}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'rgba(240,237,232,0.5)' }}>{p.focus_keyword || '—'}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <button onClick={() => advanceStatus(p)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: STATUS_COLORS[p.status || 'draft'], padding: '0.2rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {p.status || 'draft'} →
                  </button>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'rgba(240,237,232,0.4)', fontSize: '0.75rem' }}>
                  {p.created_date ? new Date(p.created_date).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <button onClick={() => setEditing({ ...p })} style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(240,237,232,0.5)', padding: '0.35rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit size={12} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setEditing(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '600px', maxWidth: '95vw', background: '#0f0f0f', borderLeft: '1px solid #1a1a1a', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#f0ede8' }}>{editing.id ? 'Edit' : 'New'} Post</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[['Title', 'title', 'text'], ['Slug', 'slug', 'text'], ['Focus Keyword', 'focus_keyword', 'text'], ['Excerpt', 'excerpt', 'textarea']].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                {type === 'textarea' ? (
                  <textarea value={editing[key] || ''} onChange={e => setEditing(p => ({ ...p, [key]: e.target.value }))} rows={3}
                    style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                ) : (
                  <input value={editing[key] || ''} onChange={e => setEditing(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none' }} />
                )}
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Body</label>
              <textarea value={editing.body || ''} onChange={e => setEditing(p => ({ ...p, body: e.target.value }))} rows={12}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Status</label>
              <select value={editing.status || 'draft'} onChange={e => setEditing(p => ({ ...p, status: e.target.value }))}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', outline: 'none' }}>
                {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={save} disabled={saving} className="btn-gold" style={{ width: '100%' }}>{saving ? 'Saving...' : 'Save Post'}</button>
          </div>
        </div>
      )}
    </div>
  );
}