import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Search, Sun, WifiOff, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { modules, navGroups, permissions } from '../lib/modules';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { AppIcon } from './Icons';

export function Layout() {
  const { profile, signOut, demoMode } = useAuth();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const role = profile?.role ?? 'staff';

  const moduleByKey: Record<string, { key: string; title: string; icon: string }> = {
    ...Object.fromEntries(modules.map((module) => [module.key, module])),
    reports: { key: 'reports', title: 'Reports', icon: 'ChartNoAxesColumn' },
  };
  const can = (key: string) => (permissions[key] ?? ['admin']).includes(role);

  const logout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {open && <button className="scrim mobile-only" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <aside className={clsx('sidebar', open && 'open')}>
        <div className="brand-row">
          <div className="brand">
            <div className="brand-mark">P</div>
            <div>
              <strong>PigTrack Pro</strong>
              <span>Farm management</span>
            </div>
          </div>
          <button className="icon-button mobile-only" onClick={() => setOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <div className="farm-card">
          <span>Workspace</span>
          <strong>PorkFolio</strong>
          <small>Mobile farm operations</small>
        </div>

        <nav className="nav-list">
          <NavLink to="/dashboard" onClick={() => setOpen(false)} className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
            <AppIcon name="LayoutDashboard" /> Dashboard
          </NavLink>
          {navGroups.map((group) => {
            const visible = group.keys.filter(can).filter((key) => moduleByKey[key]);
            if (!visible.length) return null;
            return (
              <div className="nav-group" key={group.label}>
                <span>{group.label}</span>
                {visible.map((key) => (
                  <NavLink key={key} to={`/${key}`} onClick={() => setOpen(false)} className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
                    <AppIcon name={moduleByKey[key].icon} /> {moduleByKey[key].title}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div>
            <strong>{profile?.full_name}</strong>
            <span>{role}</span>
          </div>
          <button className="icon-button" onClick={logout} aria-label="Sign out"><LogOut size={18} /></button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="global-search"><Search size={16} /><span>Search inside each module</span></div>
          <div className="topbar-actions">
            {demoMode && <span className="demo-pill"><WifiOff size={14} /> Demo mode</span>}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
