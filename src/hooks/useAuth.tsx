import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { demoProfile } from '../lib/mockData';
import { hasSupabaseConfig, supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';

type AuthContextValue = {
  profile: Profile | null;
  loading: boolean;
  demoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(hasSupabaseConfig ? null : demoProfile);
  const [loading, setLoading] = useState(hasSupabaseConfig);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let alive = true;

    const load = async () => {
      const { data: sessionData } = await client.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        if (alive) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const { data } = await client.from('profiles').select('*').eq('id', user.id).single();
      if (alive) {
        setProfile((data as Profile | null) ?? null);
        setLoading(false);
      }
    };

    const { data: listener } = client.auth.onAuthStateChange(() => load());
    load();
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    profile,
    loading,
    demoMode: !hasSupabaseConfig,
    signIn: async (email, password) => {
      if (!supabase) {
        setProfile({ ...demoProfile, email });
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signOut: async () => {
      if (!supabase) {
        setProfile(null);
        return;
      }
      await supabase.auth.signOut();
    },
  }), [profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
