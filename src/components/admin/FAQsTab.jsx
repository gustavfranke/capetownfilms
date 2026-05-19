import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function FAQsTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { base44.entities.FAQ.list('sort_order', 100).then(setItems).catch(() => {}); }, []);

  const save = async () => {
    setSaving(true);
    if (editing.id) {
      await base44.entities.FAQ.update(editing.id, editing);
      setItems(ts => ts.map(t => t.id === editing.id ? editing : t));
    } else {
      const maxOrder = Math.max(0, ...items.map(f => f.sort_order || 0));
      const created = await base44.entities.FAQ.create({ ...editing, sort_order: maxOrder + 1 });
      setItems(ts => [...ts, created]);
    }
    setSaving(false); setEditing(null);
  };

  const del = async (id) => {
    await base44.entities.FAQ.delete(id);
    setItems(ts => ts.filter(t => t.id !== id));
  };

  const moveUp = async (i) => {
    if (i === 0) return;
    const updated = [...items];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    const reordered = updated.map((f, idx) => ({ ...f, sort_order: idx }));
    setItems(reordered);
    await Promise.all(reordered.map(f => base44.entities.FAQ.update(f.id, { sort_order: f.sort_order })));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#f0ede8' }}>FAQs</h1>
        <button onClick={() => setEditing({ question: '', answer: '' })} className="btn-gold" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={14} /> Add FAQ
        </button>
      </div>

      <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: '0.8rem', marginBottom: '1rem' }}>Click the row number to move items up.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {items.length === 0 && <p style={{ color: 'rgba(240,237,232,0.3)', textAlign: 'center', padding: '3rem' }}>No FAQs yet</p>}
        {items.map((f, i) => (
          <div key={f.id} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <button onClick={() => moveUp(i)} style={{ background: 'none', border: '1px solid #1a1a1a', color: 'rgba(240,237,232,0.3)', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', marginTop: '0.1rem' }}>
              {i + 1}
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#f0ede8', fontWeight: 500, marginBottom: '0.25rem', fontFamily: 'Georgia, serif' }}>{f.question}</p>
              <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.answer?.slice(0, 100)}{f.answer?.length > 100 ? '...' : ''}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => setEditing({ ...f })} style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(240,237,232,0.5)', padding: '0.35rem', cursor: 'pointer' }}><Edit size={13} /></button>
              <button onClick={() => del(f.id)} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.6)', padding: '0.35rem', cursor: 'pointer' }}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setEditing(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '480px', maxWidth: '90vw', background: '#0f0f0f', borderLeft: '1px solid #1a1a1a', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#f0ede8' }}>{editing.id ? 'Edit' : 'New'} FAQ</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Question</label>
              <input value={editing.question || ''} onChange={e => setEditing(f => ({ ...f, question: e.target.value }))}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Answer</label>
              <textarea value={editing.answer || ''} onChange={e => setEditing(f => ({ ...f, answer: e.target.value }))} rows={6}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <button onClick={save} disabled={saving} className="btn-gold" style={{ width: '100%' }}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
}