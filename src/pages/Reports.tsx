import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFarmSnapshot } from '../hooks/useFarmData';
import { peso } from '../lib/format';

export function Reports() {
  const { tables, loading } = useFarmSnapshot();
  const pigs = tables.pigs ?? [];
  const sales = tables.sales_records ?? [];
  const expenses = tables.expenses ?? [];
  const feeding = tables.feeding_records ?? [];

  const revenue = sales.reduce((sum, row) => sum + Number(row.total_amount ?? 0), 0);
  const costs = expenses.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const activeByType = pigs.reduce<Record<string, number>>((acc, pig) => {
    if (pig.status === 'active') acc[String(pig.pig_type)] = (acc[String(pig.pig_type)] ?? 0) + 1;
    return acc;
  }, {});
  const feedKg = feeding.reduce((sum, row) => sum + Number(row.quantity_kg ?? 0), 0);
  const finance = [{ label: 'Revenue', value: revenue }, { label: 'Expenses', value: costs }, { label: 'Profit', value: revenue - costs }];

  return (
    <section className="stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Reports</h1>
          <p>Minimal summaries for inventory, feed use, and farm finances.</p>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric"><span>Revenue</span><strong>{loading ? '...' : peso(revenue)}</strong></div>
        <div className="metric"><span>Expenses</span><strong>{loading ? '...' : peso(costs)}</strong></div>
        <div className="metric"><span>Net profit</span><strong>{loading ? '...' : peso(revenue - costs)}</strong></div>
        <div className="metric"><span>Feed used</span><strong>{loading ? '...' : `${feedKg.toLocaleString('en-PH')} kg`}</strong></div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-title"><strong>Revenue vs expenses</strong></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={finance}>
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
          <div className="panel-title"><strong>Active inventory</strong></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Type</th><th>Count</th></tr></thead>
              <tbody>
                {Object.entries(activeByType).map(([type, count]) => <tr key={type}><td>{type}</td><td>{count}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
