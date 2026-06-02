import { useState } from 'react';
import { Bell, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { BottomNav, type MobileTab } from './BottomNav';
import { MoreDrawer } from './MoreDrawer';
import { MobileDashboard } from '../../pages/mobile/MobileDashboard';
import { MobileHerd } from '../../pages/mobile/MobileHerd';
import { MobileTasks } from '../../pages/mobile/MobileTasks';
import { MobileHealth } from '../../pages/mobile/MobileHealth';
import { CrudPage } from '../CrudPage';
import { modules } from '../../lib/modules';
import '../../styles/mobile.css';

const MODULE_TITLES: Record<string, string> = {
  pens:             'Pens',
  weights:          'Weight Records',
  breeding:         'Breeding',
  feeding:          'Feeding',
  'feed-inventory': 'Feed Inventory',
  sales:            'Sales',
  expenses:         'Expenses',
  reports:          'Reports',
  users:            'Users',
  breeds:           'Breeds',
};

const TAB_TITLES: Record<MobileTab, string> = {
  home:   'PorkFolio',
  herd:   'Pig Inventory',
  tasks:  'Tasks',
  health: 'Health Records',
  more:   'PorkFolio',
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function initials(name: string | undefined | null) {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moduleKey, setModuleKey] = useState<string | null>(null);
  const { profile } = useAuth();

  const handleTab = (tab: MobileTab) => {
    if (tab === 'more') {
      setDrawerOpen(true);
    } else {
      setModuleKey(null);
      setActiveTab(tab);
    }
  };

  const handleModuleNav = (key: string) => {
    setModuleKey(key);
  };

  const handleBack = () => {
    setModuleKey(null);
  };

  const isHome = activeTab === 'home' && !moduleKey;
  const moduleConfig = moduleKey ? modules.find((m) => m.key === moduleKey) : null;

  const topbarTitle = moduleKey
    ? MODULE_TITLES[moduleKey] ?? moduleKey
    : TAB_TITLES[activeTab];

  return (
    <div className="mobile-app-shell">
      {/* Top bar */}
      <header className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          {moduleKey && (
            <button className="mobile-icon-btn" onClick={handleBack} aria-label="Back" style={{ flexShrink: 0 }}>
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="mobile-topbar-left" style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: moduleKey ? 17 : 20 }}>{topbarTitle}</h1>
            {isHome && (
              <p>
                {getGreeting()}, {profile?.full_name?.split(' ')[0] ?? 'Farmer'} 👋
              </p>
            )}
          </div>
        </div>
        <div className="mobile-topbar-right">
          {isHome && (
            <button className="mobile-icon-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
          )}
          {!isHome && !moduleKey && (
            <button className="mobile-icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
          )}
          <div className="mobile-avatar">{initials(profile?.full_name)}</div>
        </div>
      </header>

      {/* Scrollable content */}
      <main className="mobile-content">
        {moduleKey && moduleConfig && (
          <div className="stack">
            <CrudPage config={moduleConfig} />
          </div>
        )}
        {!moduleKey && activeTab === 'home'   && <MobileDashboard />}
        {!moduleKey && activeTab === 'herd'   && <MobileHerd />}
        {!moduleKey && activeTab === 'tasks'  && <MobileTasks />}
        {!moduleKey && activeTab === 'health' && <MobileHealth />}
      </main>

      {/* Bottom nav */}
      <BottomNav active={activeTab} onChange={handleTab} />

      {/* More drawer */}
      <MoreDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleModuleNav}
      />
    </div>
  );
}
