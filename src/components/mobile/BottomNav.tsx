import { Home, PiggyBank, ClipboardList, HeartPulse, MoreHorizontal } from 'lucide-react';

export type MobileTab = 'home' | 'herd' | 'tasks' | 'health' | 'more';

interface BottomNavProps {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}

const TABS: { id: MobileTab; label: string; Icon: React.ElementType }[] = [
  { id: 'home',   label: 'Home',   Icon: Home },
  { id: 'herd',   label: 'Herd',   Icon: PiggyBank },
  { id: 'tasks',  label: 'Tasks',  Icon: ClipboardList },
  { id: 'health', label: 'Health', Icon: HeartPulse },
  { id: 'more',   label: 'More',   Icon: MoreHorizontal },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="mobile-bottom-nav">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`mobile-nav-tab${active === id ? ' active' : ''}`}
          onClick={() => onChange(id)}
          aria-label={label}
        >
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
