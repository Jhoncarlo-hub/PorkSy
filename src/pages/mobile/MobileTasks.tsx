import { useState, useMemo } from 'react';
import { Check } from 'lucide-react';
import { useTable } from '../../hooks/useFarmData';
import { FilterChips } from '../../components/mobile/FilterChips';
import { FAB } from '../../components/mobile/FAB';
import type { DataRow } from '../../lib/types';

const CHIPS = [
  { id: 'all',       label: 'All' },
  { id: 'pending',   label: 'Pending',   emoji: '⏳' },
  { id: 'overdue',   label: 'Overdue',   emoji: '🔴' },
  { id: 'completed', label: 'Done',      emoji: '✅' },
];

function isOverdue(row: DataRow) {
  if (!row.due_date) return false;
  return new Date(String(row.due_date)) < new Date() && row.status !== 'completed';
}

function isToday(row: DataRow) {
  if (!row.due_date) return false;
  const d = new Date(String(row.due_date));
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function TaskRow({ task, onToggle }: { task: DataRow; onToggle: (id: string | number) => void }) {
  const done     = task.status === 'completed';
  const priority = String(task.priority ?? 'medium');
  const dueDate  = task.due_date ? new Date(String(task.due_date)).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="agri-task-row">
      <div
        className={`agri-task-check${done ? ' done' : ''}`}
        onClick={() => task.id !== undefined && onToggle(task.id as string | number)}
      >
        {done && <Check size={13} />}
      </div>
      <div className="agri-task-body">
        <div className={`agri-task-title${done ? ' done' : ''}`}>{String(task.task_title ?? '—')}</div>
        <div className="agri-task-meta">
          <span>Due {dueDate}</span>
          <span className={`agri-badge ${priority}`}>{priority}</span>
          {task.task_type && <span style={{ color: 'var(--agri-muted)' }}>{String(task.task_type)}</span>}
        </div>
      </div>
    </div>
  );
}

export function MobileTasks() {
  const { rows, loading, update } = useTable('tasks');
  const [activeChip, setActiveChip] = useState('all');

  const filtered = useMemo(() => {
    if (activeChip === 'all') return rows;
    if (activeChip === 'overdue') return rows.filter(isOverdue);
    return rows.filter((r) => r.status === activeChip);
  }, [rows, activeChip]);

  const overdue   = filtered.filter(isOverdue);
  const today     = filtered.filter((r) => isToday(r) && !isOverdue(r));
  const upcoming  = filtered.filter((r) => !isOverdue(r) && !isToday(r) && r.status !== 'completed');
  const completed = filtered.filter((r) => r.status === 'completed');

  const toggle = async (id: string | number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const newStatus = row.status === 'completed' ? 'pending' : 'completed';
    await update(id, { status: newStatus });
  };


  return (
    <>
      <FilterChips chips={CHIPS} active={activeChip} onChange={setActiveChip} />

      {loading && (
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="agri-skeleton" style={{ height: 72, marginBottom: 8, borderRadius: 14 }} />
          ))}
        </>
      )}

      {!loading && filtered.length === 0 && (
        <div className="agri-empty">
          <div className="empty-icon">📋</div>
          No tasks here
        </div>
      )}

      {overdue.length > 0 && (
        <>
          <div className="agri-group-header overdue">🔴 Overdue ({overdue.length})</div>
          {overdue.map((t) => <TaskRow key={String(t.id)} task={t} onToggle={toggle} />)}
        </>
      )}

      {today.length > 0 && (
        <>
          <div className="agri-group-header today">📅 Today ({today.length})</div>
          {today.map((t) => <TaskRow key={String(t.id)} task={t} onToggle={toggle} />)}
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <div className="agri-group-header upcoming">📆 Upcoming ({upcoming.length})</div>
          {upcoming.map((t) => <TaskRow key={String(t.id)} task={t} onToggle={toggle} />)}
        </>
      )}

      {completed.length > 0 && (
        <>
          <div className="agri-group-header" style={{ color: 'var(--agri-muted)' }}>✅ Completed ({completed.length})</div>
          {completed.map((t) => <TaskRow key={String(t.id)} task={t} onToggle={toggle} />)}
        </>
      )}

      <FAB onClick={() => {}} label="Add task" />
    </>
  );
}
