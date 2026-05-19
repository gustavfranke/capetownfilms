import { useState } from 'react';
import { Users, HelpCircle, FileText, MessageSquare, Settings, Globe, BarChart2, Edit } from 'lucide-react';
import LeadsTab from '../components/admin/LeadsTab';
import QuizBuilderTab from '../components/admin/QuizBuilderTab';
import FunnelsTab from '../components/admin/FunnelsTab';
import TestimonialsTab from '../components/admin/TestimonialsTab';
import FAQsTab from '../components/admin/FAQsTab';
import ContactFormsTab from '../components/admin/ContactFormsTab';
import SettingsTab from '../components/admin/SettingsTab';
import BlogTab from '../components/admin/BlogTab';

const tabs = [
  { id: 'leads', label: 'Leads', icon: Users, component: LeadsTab },
  { id: 'quiz', label: 'Quiz Builder', icon: Edit, component: QuizBuilderTab },
  { id: 'funnels', label: 'Funnels', icon: Globe, component: FunnelsTab },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, component: TestimonialsTab },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle, component: FAQsTab },
  { id: 'forms', label: 'Contact Forms', icon: FileText, component: ContactFormsTab },
  { id: 'settings', label: 'Settings', icon: Settings, component: SettingsTab },
  { id: 'blog', label: 'Blog', icon: BarChart2, component: BlogTab },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('leads');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || LeadsTab;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#f0ede8' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '220px' : '60px',
        background: '#080808',
        borderRight: '1px solid #1a1a1a',
        flexShrink: 0,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          whiteSpace: 'nowrap',
        }}>
          {sidebarOpen && (
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.85rem', letterSpacing: '0.1em', color: '#c9a84c' }}>
              GF Admin
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.4)', cursor: 'pointer', marginLeft: 'auto', fontSize: '1.2rem', lineHeight: 1 }}
          >
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: active ? 'rgba(201,168,76,0.1)' : 'none',
                  border: 'none',
                  borderLeft: active ? '2px solid #c9a84c' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: '0.75rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  color: active ? '#c9a84c' : 'rgba(240,237,232,0.5)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span style={{ fontSize: '0.85rem' }}>{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1a1a1a' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(240,237,232,0.3)', fontSize: '0.75rem' }}>
            <Globe size={14} />
            {sidebarOpen && 'View Site'}
          </a>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
        <ActiveComponent />
      </div>
    </div>
  );
}