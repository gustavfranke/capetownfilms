import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, ChevronDown } from 'lucide-react';

const STATUS_COLORS = {
  new: { bg: 'rgba(201,168,76,0.15)', text: '#c9a84c' },
  contacted: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  booked: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  lost: { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
};

const STATUSES = ['new', 'contacted', 'booked', 'lost'];

export default function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.Lead.list('-created_date', 100).then(setLeads).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.status === s).length }), {});

  const openLead = (lead) => { setSelected(lead); setEditStatus(lead.status || 'new'); setNotes(lead.notes || ''); };

  const saveLead = async () => {
    setSaving(true);
    await base44.entities.Lead.update(selected.id, { status: editStatus, notes });
    setLeads(ls => ls.map(l => l.id === selected.id ? { ...l, status: editStatus, notes } : l));
    setSaving(false);
    setSelected(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#f0ede8' }}>Leads</h1>
        <span style={{ color: 'rgba(240,237,232,0.4)', fontSize: '0.85rem' }}>{leads.length} total</span>
      </div>

      {/* Status filter badges */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', border: '1px solid', borderColor: filter === 'all' ? '#c9a84c' : '#1e1e1e', background: filter === 'all' ? 'rgba(201,168,76,0.1)' : 'transparent', color: filter === 'all' ? '#c9a84c' : 'rgba(240,237,232,0.5)', cursor: 'pointer' }}>
          All ({leads.length})
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', border: '1px solid', borderColor: filter === s ? STATUS_COLORS[s]?.text : '#1e1e1e', background: filter === s ? STATUS_COLORS[s]?.bg : 'transparent', color: filter === s ? STATUS_COLORS[s]?.text : 'rgba(240,237,232,0.5)', cursor: 'pointer', textTransform: 'capitalize' }}>
            {s} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
              {['Name', 'Email', 'Wedding Date', 'Venue', 'Status', 'Created'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'rgba(240,237,232,0.4)', fontWeight: 500, letterSpacing: '0.05em', fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>No leads yet</td></tr>
            )}
            {filtered.map(lead => (
              <tr
                key={lead.id}
                onClick={() => openLead(lead)}
                style={{ borderBottom: '1px solid #1a1a1a', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.85rem 1rem', color: '#f0ede8' }}>{lead.name || '—'}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'rgba(240,237,232,0.6)' }}>{lead.email || '—'}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'rgba(240,237,232,0.6)' }}>{lead.wedding_date || '—'}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'rgba(240,237,232,0.6)' }}>{lead.venue || '—'}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', textTransform: 'capitalize', ...STATUS_COLORS[lead.status || 'new'] }}>
                    {lead.status || 'new'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'rgba(240,237,232,0.4)', fontSize: '0.75rem' }}>
                  {lead.created_date ? new Date(lead.created_date).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-out panel */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setSelected(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: '420px', maxWidth: '90vw', background: '#0f0f0f', borderLeft: '1px solid #1a1a1a', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#f0ede8' }}>{selected.name || 'Lead'}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {[['Email', selected.email], ['Phone', selected.phone], ['Wedding Date', selected.wedding_date], ['Venue', selected.venue], ['Funnel', selected.funnel_variant], ['Message', selected.message]].map(([k, v]) => v ? (
              <div key={k}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{k}</div>
                <div style={{ color: '#f0ede8', fontSize: '0.9rem' }}>{v}</div>
              </div>
            ) : null)}

            {selected.survey_answers && Object.keys(selected.survey_answers).length > 0 && (
              <div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Survey Answers</div>
                {Object.entries(selected.survey_answers).map(([k, v]) => (
                  <div key={k} style={{ fontSize: '0.85rem', color: 'rgba(240,237,232,0.7)', marginBottom: '0.25rem' }}><span style={{ color: 'rgba(240,237,232,0.4)' }}>{k}:</span> {v}</div>
                ))}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Status</label>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none' }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <button onClick={saveLead} disabled={saving} className="btn-gold" style={{ width: '100%' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}