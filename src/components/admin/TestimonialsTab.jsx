import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, X, Star } from 'lucide-react';

export default function TestimonialsTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { base44.entities.Testimonial.list('-created_date', 50).then(setItems).catch(() => {}); }, []);

  const save = async () => {
    setSaving(true);
    if (editing.id) {
      await base44.entities.Testimonial.update(editing.id, editing);
      setItems(ts => ts.map(t => t.id === editing.id ? editing : t));
    } else {
      const created = await base44.entities.Testimonial.create(editing);
      setItems(ts => [created, ...ts]);
    }
    setSaving(false); setEditing(null);
  };

  const del = async (id) => {
    await base44.entities.Testimonial.delete(id);
    setItems(ts => ts.filter(t => t.id !== id));
  };

  const blankEdit = { quote: '', name: '', role: '', rating: 5 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#f0ede8' }}>Testimonials</h1>
        <button onClick={() => setEditing(blankEdit)} className="btn-gold" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={14} /> Add
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.length === 0 && <p style={{ color: 'rgba(240,237,232,0.3)', textAlign: 'center', padding: '3rem' }}>No testimonials yet</p>}
        {items.map(t => (
          <div key={t.id} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={12} fill="#c9a84c" color="#c9a84c" />)}
              </div>
              <p style={{ color: '#f0ede8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.5rem', fontStyle: 'italic' }}>"{t.quote || t.text || ''}"</p>
              <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: '0.8rem' }}>{t.name || t.couple_name} · {t.role || t.venue}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => setEditing({ ...t })} style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(240,237,232,0.5)', padding: '0.35rem', cursor: 'pointer' }}><Edit size={13} /></button>
              <button onClick={() => del(t.id)} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.6)', padding: '0.35rem', cursor: 'pointer' }}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setEditing(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '420px', maxWidth: '90vw', background: '#0f0f0f', borderLeft: '1px solid #1a1a1a', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#f0ede8' }}>{editing.id ? 'Edit' : 'New'} Testimonial</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[['Quote', 'quote', 'textarea'], ['Name', 'name', 'text'], ['Role / Venue', 'role', 'text'], ['Rating (1-5)', 'rating', 'number']].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                {type === 'textarea' ? (
                  <textarea value={editing[key] || ''} onChange={e => setEditing(t => ({ ...t, [key]: e.target.value }))} rows={4}
                    style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                ) : (
                  <input type={type} value={editing[key] || ''} onChange={e => setEditing(t => ({ ...t, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                    style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none' }} />
                )}
              </div>
            ))}
            <button onClick={save} disabled={saving} className="btn-gold" style={{ width: '100%' }}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
}