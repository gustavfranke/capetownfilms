import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Save } from 'lucide-react';

export default function SettingsTab() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.SiteSettings.list('-created_date', 1)
      .then(data => setSettings(data?.[0] || { site_name: 'Gustav Franke Cinematography', contact_email: '', seo_title: '', seo_description: '', reply_time_text: 'Within 24 hours', split_test_enabled: false }))
      .catch(() => setSettings({ site_name: 'Gustav Franke Cinematography', contact_email: '', seo_title: '', seo_description: '', reply_time_text: 'Within 24 hours', split_test_enabled: false }));
  }, []);

  const save = async () => {
    setSaving(true);
    if (settings.id) {
      await base44.entities.SiteSettings.update(settings.id, settings);
    } else {
      const created = await base44.entities.SiteSettings.create(settings);
      setSettings(created);
    }
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return <div style={{ color: 'rgba(240,237,232,0.4)', padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  const field = (label, key, type = 'text', extraProps = {}) => (
    <div key={key}>
      <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
      {type === 'textarea' ? (
        <textarea value={settings[key] || ''} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} rows={3}
          style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
      ) : type === 'checkbox' ? (
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!settings[key]} onChange={e => setSettings(s => ({ ...s, [key]: e.target.checked }))} style={{ accentColor: '#c9a84c', width: '16px', height: '16px' }} />
          <span style={{ color: 'rgba(240,237,232,0.6)', fontSize: '0.9rem' }}>{extraProps.checkLabel}</span>
        </label>
      ) : (
        <input type={type} value={settings[key] || ''} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
          style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', padding: '0.6rem', fontSize: '0.9rem', outline: 'none' }} />
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#f0ede8', marginBottom: '2rem' }}>Site Settings</h1>

      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {field('Site Name', 'site_name')}
        {field('Contact Email', 'contact_email', 'email')}
        {field('SEO Title', 'seo_title')}
        {field('SEO Description', 'seo_description', 'textarea')}
        {field('Reply Time Text', 'reply_time_text')}
        {field('Split Test', 'split_test_enabled', 'checkbox', { checkLabel: 'Enable A/B split testing' })}

        <button onClick={save} disabled={saving} className="btn-gold" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
          <Save size={14} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}