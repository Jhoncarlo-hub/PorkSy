import { useNavigate } from 'react-router-dom';
import { Weight, AlertTriangle, TrendingUp, HeartPulse, Package, ChevronRight, ClipboardList } from 'lucide-react';
import { useFarmSnapshot } from '../../hooks/useFarmData';
import { kg, peso } from '../../lib/format';
import { FarmBanner } from '../../components/mobile/FarmBanner';
import { FAB } from '../../components/mobile/FAB';

export function MobileDashboard() {
  const { tables, loading } = useFarmSnapshot();
  const navigate = useNavigate();

  const pigs     = tables.pigs ?? [];
  const sales    = tables.sales_records ?? [];
  const expenses = tables.expenses ?? [];
  const feed     = tables.feed_inventory ?? [];
  const tasks    = tables.tasks ?? [];
  const health   = tables.health_records ?? [];

  const activePigs      = pigs.filter((p) => p.status === 'active');
  const totalSales      = sales.reduce((s, r) => s + Number(r.total_amount ?? 0), 0);
  const totalExpenses   = expenses.reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const netProfit       = totalSales - totalExpenses;
  const lowFeedItems    = feed.filter((r) => Number(r.quantity_kg ?? 0) <= Number(r.minimum_stock_kg ?? 0));
  const pendingTasks    = tasks.filter((r) => r.status === 'pending' || r.status === 'overdue');
  const avgWeight       = activePigs.length
    ? activePigs.reduce((s, p) => s + Number(p.current_weight ?? 0), 0) / activePigs.length
    : 0;

  // Rough health score: % of health records that are not critical
  const criticalHealth  = health.filter((r) => r.record_type === 'diagnosis').length;
  const healthScore     = health.length ? Math.max(0, Math.round(100 - (criticalHealth / health.length) * 100)) : 100;

  const maxBar = Math.max(totalSales, totalExpenses, 1);


  return (
    <>
      <FarmBanner />

      {/* Hero card */}
      <div className="agri-hero-card">
        <div className="agri-hero-card-content">
          <h2>Active Pigs</h2>
          <div className="hero-number">{loading ? '...' : activePigs.length}</div>
          <div className="hero-trend">+{loading ? '–' : Math.floor(activePigs.length * 0.09)} this month</div>
        </div>
        <div className="agri-hero-card-pig">🐷</div>
      </div>

      {/* Metric grid row 1 */}
      <div className="agri-metric-grid">
        <div className="agri-metric-card">
          <div className="metric-icon-wrap"><Weight size={18} /></div>
          <div className="metric-label">Avg Weight</div>
          <div className="metric-value">{loading ? '...' : kg(avgWeight)}</div>
          <div className="metric-trend">+2 kg this week</div>
        </div>
        <div className="agri-metric-card">
          <div className="metric-icon-wrap danger"><Package size={18} /></div>
          <div className="metric-label">Low Feed</div>
          <div className="metric-value danger">{loading ? '...' : lowFeedItems.length}</div>
          <div className="metric-trend danger">
            {lowFeedItems.length > 0 ? 'Needs attention' : 'All stocked'}
          </div>
        </div>
      </div>

      {/* Metric grid row 2 */}
      <div className="agri-metric-grid">
        <div className="agri-metric-card">
          <div className="metric-icon-wrap"><TrendingUp size={18} /></div>
          <div className="metric-label">Revenue</div>
          <div className="metric-value" style={{ fontSize: 16 }}>{loading ? '...' : peso(totalSales)}</div>
          <div className="metric-trend">+15% vs last month</div>
        </div>
        <div className="agri-metric-card">
          <div className="metric-icon-wrap"><HeartPulse size={18} /></div>
          <div className="metric-label">Health Score</div>
          <div className="metric-value">{loading ? '...' : `${healthScore}%`}</div>
          <div className="metric-trend">{healthScore >= 80 ? 'Good' : healthScore >= 60 ? 'Fair' : 'Needs care'}</div>
        </div>
      </div>

      {/* Finance snapshot */}
      <div className="agri-finance-card">
        <div className="finance-header">
          <span className="finance-title">Finance Snapshot</span>
          <span className="finance-net">{loading ? '...' : peso(netProfit)} net</span>
        </div>
        <div className="agri-finance-bar-row">
          <span className="agri-finance-bar-name">Sales</span>
          <div className="agri-finance-bar-track">
            <div className="agri-finance-bar-fill" style={{ width: `${(totalSales / maxBar) * 100}%`, background: '#52b788' }} />
          </div>
        </div>
        <div className="agri-finance-bar-row">
          <span className="agri-finance-bar-name">Expenses</span>
          <div className="agri-finance-bar-track">
            <div className="agri-finance-bar-fill" style={{ width: `${(totalExpenses / maxBar) * 100}%`, background: '#e9c46a' }} />
          </div>
        </div>
        <div className="agri-finance-bar-row">
          <span className="agri-finance-bar-name">Profit</span>
          <div className="agri-finance-bar-track">
            <div className="agri-finance-bar-fill" style={{ width: `${Math.max(0, (netProfit / maxBar)) * 100}%`, background: '#2d6a4f' }} />
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="agri-section-title">Alerts</div>

      {loading && <div className="agri-skeleton" style={{ height: 60, marginBottom: 8 }} />}

      {!loading && lowFeedItems.length === 0 && pendingTasks.length === 0 && (
        <div className="agri-empty">
          <div className="empty-icon">✅</div>
          No alerts right now — farm is running great!
        </div>
      )}

      {lowFeedItems.slice(0, 3).map((item) => (
        <div key={String(item.id)} className="agri-alert-row" onClick={() => navigate('/feed-inventory')}>
          <div className="agri-alert-icon amber"><AlertTriangle size={20} /></div>
          <div className="agri-alert-body">
            <div className="agri-alert-title">Feed stock low</div>
            <div className="agri-alert-sub">Type #{item.feed_type_id} — {item.quantity_kg} kg remaining</div>
          </div>
          <ChevronRight size={16} className="agri-alert-chevron" />
        </div>
      ))}

      {pendingTasks.slice(0, 3).map((task) => (
        <div key={String(task.id)} className="agri-alert-row" onClick={() => navigate('/tasks')}>
          <div className="agri-alert-icon green"><ClipboardList size={20} /></div>
          <div className="agri-alert-body">
            <div className="agri-alert-title">{String(task.task_title)}</div>
            <div className="agri-alert-sub">Due {String(task.due_date ?? '—')} · {String(task.priority ?? 'medium')}</div>
          </div>
          <ChevronRight size={16} className="agri-alert-chevron" />
        </div>
      ))}

      <FAB onClick={() => navigate('/pigs')} label="Add pig" />
    </>
  );
}
