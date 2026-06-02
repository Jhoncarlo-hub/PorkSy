import { AlertTriangle, CalendarCheck, Package, PiggyBank, Scale, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFarmSnapshot } from '../hooks/useFarmData';
import { kg, peso } from '../lib/format';

export function Dashboard() {
  const { tables, loading, error } = useFarmSnapshot();
  const pigs = tables.pigs ?? [];
  const sales = tables.sales_records ?? [];
  const expenses = tables.expenses ?? [];
  const feed = tables.feed_inventory ?? [];
  const tasks = tables.tasks ?? [];

  const activePigs = pigs.filter((pig) => pig.status === 'active');
  const monthlySales = sales.reduce((sum, row) => sum + Number(row.total_amount ?? 0), 0);
  const monthlyExpenses = expenses.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const lowFeed = feed.filter((row) => Number(row.quantity_kg ?? 0) <= Number(row.minimum_stock_kg ?? 0));
  const pendingTasks = tasks.filter((row) => row.status === 'pending');
  const chart = [
    { label: 'Sales', value: monthlySales },
    { label: 'Expenses', value: monthlyExpenses },
    { label: 'Profit', value: monthlySales - monthlyExpenses },
  ];

  return (
    <section className="stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Today</p>
          <h1>Dashboard</h1>
          <p>Plain view of inventory, money, alerts, and pending farm work.</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      <div className="metric-grid">
        <Metric icon={<PiggyBank />} label="Active pigs" value={loading ? '...' : activePigs.length} />
        <Metric icon={<Scale />} label="Avg weight" value={loading ? '...' : kg(activePigs.reduce((s, p) => s + Number(p.current_weight ?? 0), 0) / Math.max(activePigs.length, 1))} />
        <Metric icon={<TrendingUp />} label="Revenue" value={loading ? '...' : peso(monthlySales)} />
        <Metric icon={<Package />} label="Low feed" value={loading ? '...' : lowFeed.length} />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-title"><strong>Finance snapshot</strong><span>{peso(monthlySales - monthlyExpenses)} net</span></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => `PHP ${Number(v) / 1000}k`} />
                <Tooltip formatter={(value) => peso(value)} />
                <Bar dataKey="value" fill="var(--chart)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title"><strong>Alerts</strong><span>{lowFeed.length + pendingTasks.length} open</span></div>
          <div className="alert-list">
            {lowFeed.map((row) => <AlertRow key={`feed-${row.id}`} icon={<AlertTriangle />} title={`Feed type #${row.feed_type_id} is low`} detail={`${row.quantity_kg} kg left, minimum ${row.minimum_stock_kg} kg`} />)}
            {pendingTasks.slice(0, 6).map((row) => <AlertRow key={`task-${row.id}`} icon={<CalendarCheck />} title={String(row.task_title)} detail={`Due ${row.due_date} - ${row.priority}`} />)}
            {!lowFeed.length && !pendingTasks.length && <div className="soft-note">No low feed or pending tasks.</div>}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><strong>Recent pigs</strong><span>{activePigs.length} active</span></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Tag</th><th>Type</th><th>Pen</th><th>Weight</th><th>Status</th></tr></thead>
            <tbody>
              {activePigs.slice(0, 8).map((pig) => <tr key={String(pig.id)}><td>{pig.pig_tag}</td><td>{pig.pig_type}</td><td>{pig.pen_id ?? '-'}</td><td>{kg(pig.current_weight)}</td><td>{pig.status}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return <div className="metric"><div>{icon}</div><span>{label}</span><strong>{value}</strong></div>;
}

function AlertRow({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return <div className="alert-row"><div>{icon}</div><section><strong>{title}</strong><span>{detail}</span></section></div>;
}
