import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { MobileLayout } from './components/mobile/MobileLayout';
import { CrudPage } from './components/CrudPage';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Reports } from './pages/Reports';
import { modules, permissions } from './lib/modules';
import { useIsMobile } from './hooks/useIsMobile';

function Protected({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="boot">Loading PorkFolio...</div>;
  if (!profile) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function RoleRoute({ pageKey, children }: { pageKey: string; children: ReactNode }) {
  const { profile } = useAuth();
  const allowed = permissions[pageKey] ?? ['admin'];
  if (!profile || !allowed.includes(profile.role)) {
    return <div className="panel"><h2>Access restricted</h2><p>Your role does not have access to this module.</p></div>;
  }
  return children;
}

// Mobile: standalone SPA shell (not nested routes — manages its own tabs)
function MobileApp() {
  return (
    <Protected>
      <MobileLayout />
    </Protected>
  );
}

// Desktop: uses nested route layout with Outlet
function DesktopRoutes() {
  return (
    <Protected>
      <Layout />
    </Protected>
  );
}

function AppRoutes() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Mobile: all paths go to MobileLayout which manages its own navigation */}
        <Route path="*" element={<MobileApp />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DesktopRoutes />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<RoleRoute pageKey="dashboard"><Dashboard /></RoleRoute>} />
        <Route path="reports" element={<RoleRoute pageKey="reports"><Reports /></RoleRoute>} />
        {modules.filter((module) => module.key !== 'reports').map((module) => (
          <Route key={module.key} path={module.key} element={<RoleRoute pageKey={module.key}><CrudPage config={module} /></RoleRoute>} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
