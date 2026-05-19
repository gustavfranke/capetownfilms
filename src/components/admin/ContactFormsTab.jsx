import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, X, Trash2 } from 'lucide-react';

export default function ContactFormsTab() {
  const [forms, setForms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { base44.entities.ContactForm.list('-created_date', 50).then(setForms).catch(() => {}); }, []);

  const save = async () => {
    setSaving(true);
    if (editing.id) {
      await base44.entities.ContactForm.update(editing.id, editing);
      setForms(fs => fs.map(f => f.id === editing.id ? editing : f));
    } else {
      const created = await base44.entities.ContactForm.create(editing);
      setForms(fs => [created, ...fs]);
    }
    setSaving(false); setEditing(null);
  };

  const blank = { name: '', heading: '', subheading: '', button_text: 'Send Message', success_message: "Thanks! I'll be in touch soon.", fields: [] };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#f0ede8' }}>Contact Forms</h1>
        <button onClick={() => setEditing(blank)} className="btn-gold" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={14} /> New Form
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {forms.length === 0 && <p style={{ color: 'rgba(240,237,232,0.3)', gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>No forms yet</p>}
        {forms.map(f => (
          <div key={f.id} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#f0ede8', marginBottom: '0.5rem' }}>{f.name || f.heading || 'Untitled Form'}</h3>
            <p style={{ fontSize: '0.75rem', color: 'rgba(240,237,232,0.4)', marginBottom: '1rem' }}>{f.heading || '—'}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(240,237,232,0.4)', marginBottom: '1rem' }}>{(f.fields || []).length} fields</p>
            <button onClick={() => setEditing({ ...f })} style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(240,237,232,0.6)', padding: '0.35rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Edit size={12} /> Edit
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setEditing(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '480px', maxWidth: '90vw', background: '#0f0f0f', borderLeft: '1px solid #1a1a1a', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#f0ede8' }}>Edit Form</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[['Form Name', 'name'], ['Heading', 'heading'], ['Subheading', 'subheading'], ['Button Text', 'button_text'], ['Success Message', 'success_message']].map(([label, key]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                <input value={editing[key] || ''} onChange={e => setEditing(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none' }} />
              </div>
            ))}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase' }}>Fields</label>
                <button onClick={() => setEditing(f => ({ ...f, fields: [...(f.fields || []), { name: '', label: '', type: 'text', required: false }] }))}
                  style={{ background: 'none', border: '1px solid #1e1e1e', color: '#c9a84c', padding: '0.25rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer' }}>
                  + Add Field
                </button>
              </div>
              {(editing.fields || []).map((field, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input placeholder="label" value={field.label} onChange={e => { const fs = [...editing.fields]; fs[i] = { ...fs[i], label: e.target.value }; setEditing(f => ({ ...f, fields: fs })); }}
                    style={{ flex: 1, background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.5rem', fontSize: '0.8rem', outline: 'none' }} />
                  <select value={field.type} onChange={e => { const fs = [...editing.fields]; fs[i] = { ...fs[i], type: e.target.value }; setEditing(f => ({ ...f, fields: fs })); }}
                    style={{ background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.5rem', fontSize: '0.8rem', outline: 'none' }}>
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="date">Date</option>
                    <option value="textarea">Textarea</option>
                  </select>
                  <button onClick={() => setEditing(f => ({ ...f, fields: f.fields.filter((_, fi) => fi !== i) }))}
                    style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.5)', cursor: 'pointer', padding: '0.25rem' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={save} disabled={saving} className="btn-gold" style={{ width: '100%' }}>{saving ? 'Saving...' : 'Save Form'}</button>
          </div>
        </div>
      )}
    </div>
  );
}