import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useTable } from '../../hooks/useFarmData';
import { kg } from '../../lib/format';
import { FilterChips } from '../../components/mobile/FilterChips';
import { FAB } from '../../components/mobile/FAB';
import type { DataRow } from '../../lib/types';

const CHIPS = [
  { id: 'all',      label: 'All' },
  { id: 'sow',      label: 'Sow',      emoji: '🐷' },
  { id: 'boar',     label: 'Boar',     emoji: '🐗' },
  { id: 'grower',   label: 'Grower',   emoji: '🐽' },
  { id: 'gilt',     label: 'Gilt',     emoji: '🐷' },
  { id: 'finisher', label: 'Finisher', emoji: '🏁' },
  { id: 'piglet',   label: 'Piglet',   emoji: '🐖' },
];

function pigEmoji(status: string) {
  if (status === 'sold')      return '🐷';
  if (status === 'deceased')  return '🐷';
  return '🐷';
}

function PigRow({ pig }: { pig: DataRow }) {
  const status  = String(pig.status ?? 'active');
  const pigType = String(pig.pig_type ?? '—');
  const penId   = pig.pen_id ? `Pen ${pig.pen_id}` : 'No pen';
  const weight  = pig.current_weight ? kg(pig.current_weight) : '—';

  return (
    <div className="agri-pig-row">
      <div className={`agri-pig-avatar ${status}`}>
        {pigEmoji(status)}
      </div>
      <div className="agri-pig-info">
        <div className="agri-pig-tag">{String(pig.pig_tag ?? '—')}</div>
        <div className="agri-pig-meta">
          {pigType} · {penId} · {weight}
        </div>
      </div>
      <span className={`agri-badge ${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

export function MobileHerd() {
  const { rows, loading } = useTable('pigs');
  const [activeChip, setActiveChip] = useState('all');
  const [query, setQuery] = useState('');
  const [showSearch] = useState(false);

  const filtered = useMemo(() => {
    let result = rows;
    if (activeChip !== 'all') {
      result = result.filter((r) => String(r.pig_type ?? '').toLowerCase() === activeChip);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((r) =>
        String(r.pig_tag ?? '').toLowerCase().includes(q) ||
        String(r.pig_type ?? '').toLowerCase().includes(q) ||
        String(r.status ?? '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [rows, activeChip, query]);


  return (
    <>
      {/* Search bar (toggleable) */}
      {showSearch && (
        <div style={{
          background: 'var(--agri-surface)',
          border: '1.5px solid var(--agri-border)',
          borderRadius: 14,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
        }}>
          <Search size={16} color="var(--agri-muted)" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by tag, type, status..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              flex: 1,
              fontSize: 14,
              color: 'var(--agri-text)',
            }}
          />
        </div>
      )}

      <FilterChips chips={CHIPS} active={activeChip} onChange={setActiveChip} />

      {/* Count */}
      <div style={{ fontSize: 12, color: 'var(--agri-muted)', marginBottom: 10 }}>
        {loading ? 'Loading...' : `${filtered.length} animals${activeChip !== 'all' ? ` · ${activeChip}` : ''}`}
      </div>

      {/* Pig list */}
      {loading && (
        <>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="agri-skeleton" style={{ height: 64, marginBottom: 8, borderRadius: 14 }} />
          ))}
        </>
      )}

      {!loading && filtered.length === 0 && (
        <div className="agri-empty">
          <div className="empty-icon">🐷</div>
          No pigs found
        </div>
      )}

      {filtered.map((pig) => (
        <PigRow key={String(pig.id)} pig={pig} />
      ))}

      <FAB onClick={() => {}} label="Add pig" />
    </>
  );
}

// Export header actions for topbar
export function HerdHeaderActions({ onSearch }: { onSearch: () => void }) {
  return (
    <>
      <button className="mobile-icon-btn" onClick={onSearch} aria-label="Search">
        <Search size={18} />
      </button>
      <button className="mobile-icon-btn" aria-label="Filter">
        <SlidersHorizontal size={18} />
      </button>
    </>
  );
}
