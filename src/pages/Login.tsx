import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export function Login() {
  const { profile, signIn, demoMode } = useAuth();
  const [email, setEmail] = useState('admin@piggery.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (profile) return <Navigate to="/dashboard" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <button className="theme-toggle login-theme" onClick={toggleTheme} aria-label="Toggle dark mode">
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
      <section className="login-panel">
        <div className="brand compact">
          <div className="brand-mark">P</div>
          <div>
            <strong>PigTrack Pro</strong>
            <span>Modern farm management</span>
          </div>
        </div>
        <h1>Sign in</h1>
        <p>Use your Supabase account. Without env keys, the app opens in demo mode.</p>

        <form onSubmit={submit} className="login-form">
          <label>
            <span>Email</span>
            <div className="input-with-icon"><Mail size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          </label>
          <label>
            <span>Password</span>
            <div className="input-with-icon"><LockKeyhole size={16} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
          </label>
          {error && <div className="alert">{error}</div>}
          {demoMode && <div className="soft-note">Demo mode is active because Supabase env keys are not configured.</div>}
          <button className="primary-action" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </section>
    </main>
  );
}
