import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabaseAdmin as supabase } from '../../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  role: string | null;
  isSuperAdmin: boolean;
  isEventManager: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isEventManager, setIsEventManager] = useState(false);

  const determineRoles = async (currentUser: User | null) => {
    if (!currentUser) {
      try {
        const activeRbac = localStorage.getItem('ngo_rbac_active_session');
        if (activeRbac) {
          const match = JSON.parse(activeRbac);
          const mockUser: any = { 
            id: match.id, 
            email: match.email, 
            user_metadata: { full_name: match.name } 
          };
          setUser(mockUser);
          const userRole = match.role;
          setRole(userRole);
          const isSuper = userRole === 'super_admin' || userRole === 'admin';
          const isEventMgr = userRole === 'event_manager' || isSuper;
          setIsAdmin(isSuper || isEventMgr);
          setIsSuperAdmin(isSuper);
          setIsEventManager(isEventMgr);
          return;
        }
      } catch (e) {
        console.warn("Error reading active RBAC session:", e);
      }

      setIsAdmin(false);
      setRole(null);
      setIsSuperAdmin(false);
      setIsEventManager(false);
      return;
    }

    const email = currentUser.email?.toLowerCase() || '';
    const superAdminEmails = ((import.meta as any).env?.VITE_ADMIN_ALLOWED_EMAILS || 'srishreevisionfoundation1@gmail.com')
      .toLowerCase()
      .split(',')
      .map((e: string) => e.trim());

    // 1. Check if super admin by environment email
    if (superAdminEmails.includes(email)) {
      setIsAdmin(true);
      setRole('super_admin');
      setIsSuperAdmin(true);
      setIsEventManager(true);
      return;
    }

    // 2. Check local/shared custom RBAC team members list
    try {
      const storedMembers = localStorage.getItem('ngo_rbac_team_members');
      if (storedMembers) {
        const members = JSON.parse(storedMembers);
        const match = members.find((m: any) => m.email?.toLowerCase() === email || m.id === currentUser.id);
        if (match && match.role) {
          const userRole = match.role;
          setRole(userRole);
          const isSuper = userRole === 'super_admin' || userRole === 'admin';
          const isEventMgr = userRole === 'event_manager' || isSuper;
          setIsAdmin(isSuper || isEventMgr);
          setIsSuperAdmin(isSuper);
          setIsEventManager(isEventMgr);
          return;
        }
      }
    } catch (e) {
      console.warn("Error reading RBAC team members:", e);
    }

    // 3. Check Supabase profiles table
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();
      
      if (data && data.role) {
        const userRole = data.role;
        setRole(userRole);
        const isSuper = userRole === 'super_admin' || userRole === 'admin';
        const isEventMgr = userRole === 'event_manager' || isSuper;
        setIsAdmin(isSuper || isEventMgr);
        setIsSuperAdmin(isSuper);
        setIsEventManager(isEventMgr);
        return;
      }
    } catch (e) {
      console.warn("Error fetching role from profile:", e);
    }

    // Default: normal user
    setIsAdmin(false);
    setRole('user');
    setIsSuperAdmin(false);
    setIsEventManager(false);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      determineRoles(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      determineRoles(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      localStorage.removeItem('ngo_rbac_active_session');
    } catch (e) {}
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, isAdmin, role, isSuperAdmin, isEventManager, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
