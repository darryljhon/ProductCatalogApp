import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

interface Profile {
  full_name: string;
  username: string;
  phone: string;
  role: string;
  // add other profile fields here
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  profile: Profile | null;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      supabase
        .from('profiles')
        .select('full_name, username, phone, role')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data, error }: { data: Profile | null, error: any }) => {
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(data as Profile);
          }
          setLoading(false);
        });
    }
  }, [user]);

  const updateProfile = async (newProfile: Partial<Profile>) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update(newProfile).eq('id', user.id);
    if (error) throw error;
    setProfile({ ...profile, ...newProfile } as Profile);
  };

  const isAdmin = profile?.role === 'admin';

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isAdmin,
    profile,
    updateProfile,
  }), [user, session, loading, isAdmin, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
