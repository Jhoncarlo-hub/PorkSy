import { useMemo, useState } from 'react';
import { useTable } from '../../hooks/useFarmData';
import { FilterChips } from '../../components/mobile/FilterChips';
import { FAB } from '../../components/mobile/FAB';
import type { DataRow } from '../../lib/types';

const CHIPS = [
  { id: 'all',         label: 'All' },
  { id: 'vaccination', label: 'Vaccination', emoji: '💉' },
  { id: 'treatment',   label: 'Treatment',   emoji: '💊' },
  { id: 'deworming',   label: 'Deworming',   emoji: '🐛' },
  { id: 'diagnosis',   label: 'Diagnosis',   emoji: '🩺' },
];

const ICON_MAP: Record<string, string> = {
  vaccination: '💉',
  treatment:   '💊',
  deworming:   '🐛',
  vitamin:     '🌿',
  diagnosis:   '🩺',
  surgery:     '🔧',
};

function iconClass(type: string) {
  if (type === 'diagnosis') return 'critical';
  if (type === 'treatment' || type === 'surgery') return 'treatment';
  return '';
}

function HealthRow({ record }: { record: DataRow }) {
  const rtype    = String(record.record_type ?? 'vaccination');
  const date     = record.health_date
    ? new Date(String(record.health_date)).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';
  const pigLabel = record.pig_id ? `Pig #${record.pig_id}` : record.pen_id ? `Pen #${record.pen_id}` : 'General';
  const medicine = record.medicine_name ? String(record.medicine_name) : null;

  return (
    <div className="agri-health-row">
      <div className={`agri-health-icon ${iconClass(rtype)}`}>
        {ICON_MAP[rtype] ?? '🏥'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--agri-text)', marginBottom: 2 }}>
          {rtype.charAt(0).toUpperCase() + rtype.slice(1)}
          {medicine && <span style={{ fontWeight: 400, color: 'var(--agri-muted)' }}> · {medicine}</span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--agri-muted)' }}>
          {pigLabel} · {date}
        </div>
        {record.next_due_date && (
          <div style={{ fontSize: 11, color: 'var(--agri-green)', marginTop: 2 }}>
            Next: {new Date(String(record.next_due_date)).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
      <span className={`agri-badge ${rtype === 'diagnosis' ? 'high' : rtype === 'treatment' ? 'medium' : 'active'}`}>
        {rtype === 'diagnosis' ? 'Needs Care' : rtype === 'treatment' ? 'Treatment' : 'OK'}
      </span>
    </div>
  );
}

export function MobileHealth() {
  const { rows, loading } = useTable('health_records');
  const [activeChip, setActiveChip] = useState('all');

  const filtered = useMemo(() => {
    if (activeChip === 'all') return rows;
    return rows.filter((r) => r.record_type === activeChip);
  }, [rows, activeChip]);

  return (
    <>
      <FilterChips chips={CHIPS} active={activeChip} onChange={setActiveChip} />

      <div style={{ fontSize: 12, color: 'var(--agri-muted)', marginBottom: 10 }}>
        {loading ? 'Loading...' : `${filtered.length} records`}
      </div>

      {loading && (
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="agri-skeleton" style={{ height: 64, marginBottom: 8, borderRadius: 14 }} />
          ))}
        </>
      )}

      {!loading && filtered.length === 0 && (
        <div className="agri-empty">
          <div className="empty-icon">🏥</div>
          No health records yet
        </div>
      )}

      {filtered.map((record) => (
        <HealthRow key={String(record.id)} record={record} />
      ))}

      <FAB onClick={() => {}} label="Add health record" />
    </>
  );
}
