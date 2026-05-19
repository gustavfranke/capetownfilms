import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Edit, Eye, X } from 'lucide-react';

export default function FunnelsTab() {
  const [variants, setVariants] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.PageVariant.list('-created_date', 50).then(setVariants).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    if (editing.id) {
      await base44.entities.PageVariant.update(editing.id, editing);
      setVariants(vs => vs.map(v => v.id === editing.id ? editing : v));
    } else {
      const created = await base44.entities.PageVariant.create(editing);
      setVariants(vs => [created, ...vs]);
    }
    setSaving(false);
    setEditing(null);
  };

  const toggleActive = async (v) => {
    const updated = { ...v, is_active: !v.is_active };
    await base44.entities.PageVariant.update(v.id, { is_active: updated.is_active });
    setVariants(vs => vs.map(x => x.id === v.id ? updated : x));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#f0ede8' }}>Funnels</h1>
        <button onClick={() => setEditing({ slug: '', hero_headline: '', hero_subheadline: '', cta_text: '', is_active: true })} className="btn-gold" style={{ fontSize: '0.75rem' }}>
          + New Funnel
        </button>
      </div>

      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
              {['Slug', 'Headline', 'CTA Text', 'Active', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'rgba(240,237,232,0.4)', fontWeight: 500, letterSpacing: '0.05em', fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.length === 0 && <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>No funnels yet</td></tr>}
            {variants.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '0.85rem 1rem', color: '#c9a84c' }}>/{v.slug}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#f0ede8' }}>{v.hero_headline || '—'}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'rgba(240,237,232,0.6)' }}>{v.cta_text || '—'}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <button onClick={() => toggleActive(v)} style={{ background: v.is_active ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)', border: 'none', color: v.is_active ? '#4ade80' : 'rgba(240,237,232,0.3)', padding: '0.2rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer' }}>
                    {v.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ padding: '0.85rem 1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setEditing({ ...v })} style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(240,237,232,0.5)', padding: '0.3rem 0.5rem', cursor: 'pointer' }}><Edit size={12} /></button>
                  <a href={`/${v.slug}`} target="_blank" rel="noopener noreferrer" style={{ background: 'none', border: '1px solid #1e1e1e', color: 'rgba(240,237,232,0.5)', padding: '0.3rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none' }}><Eye size={12} /></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setEditing(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '420px', maxWidth: '90vw', background: '#0f0f0f', borderLeft: '1px solid #1a1a1a', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#f0ede8' }}>Edit Funnel</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[['Slug', 'slug'], ['Badge Text', 'badge_text'], ['Hero Headline', 'hero_headline'], ['Hero Subheadline', 'hero_subheadline'], ['CTA Button Text', 'cta_text']].map(([label, key]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                <input value={editing[key] || ''} onChange={e => setEditing(v => ({ ...v, [key]: e.target.value }))}
                  style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none' }} />
              </div>
            ))}
            <button onClick={save} disabled={saving} className="btn-gold" style={{ width: '100%' }}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
}