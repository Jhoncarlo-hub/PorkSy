interface MoreDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (key: string) => void;
}

const MORE_MODULES = [
  { key: 'pens',           label: 'Pens',       emoji: '🏠', color: '#e8f4fd' },
  { key: 'weights',        label: 'Weights',    emoji: '⚖️', color: '#f3e5f5' },
  { key: 'breeding',       label: 'Breeding',   emoji: '🐣', color: '#fce4ec' },
  { key: 'feeding',        label: 'Feeding',    emoji: '🌾', color: '#f1f8e9' },
  { key: 'feed-inventory', label: 'Feed Stock', emoji: '📦', color: '#fff8e1' },
  { key: 'sales',          label: 'Sales',      emoji: '💰', color: '#e8f5e9' },
  { key: 'expenses',       label: 'Expenses',   emoji: '📊', color: '#fbe9e7' },
  { key: 'reports',        label: 'Reports',    emoji: '📈', color: '#e3f2fd' },
  { key: 'users',          label: 'Users',      emoji: '👥', color: '#ede7f6' },
  { key: 'breeds',         label: 'Breeds',     emoji: '🏷️', color: '#e0f7fa' },
];

export function MoreDrawer({ open, onClose, onNavigate }: MoreDrawerProps) {
  if (!open) return null;

  return (
    <div className="agri-drawer-overlay" onClick={onClose}>
      <div className="agri-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="agri-drawer-handle" />
        <div className="agri-drawer-title">More Modules</div>
        <div className="agri-module-grid">
          {MORE_MODULES.map(({ key, label, emoji, color }) => (
            <button
              key={key}
              className="agri-module-tile"
              onClick={() => { onNavigate(key); onClose(); }}
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <div className="agri-module-icon" style={{ background: color }}>
                <span style={{ fontSize: 26 }}>{emoji}</span>
              </div>
              <span className="agri-module-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
