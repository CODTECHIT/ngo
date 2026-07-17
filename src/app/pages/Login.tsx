import { useState } from 'react';
import { usePublicAuth } from '../contexts/PublicAuthContext';
import { Navigate, Link } from 'react-router';
import { supabase } from '../../lib/supabase';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { SectionLabel } from '../components/Layout';
import { motion } from 'motion/react';

export default function Login() {
  const { user, loading } = usePublicAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else if (data?.user) {
      const allowedEmails = (import.meta.env.VITE_ADMIN_ALLOWED_EMAILS || "")
        .split(",")
        .map((e: string) => e.trim().toLowerCase());
        
      if (allowedEmails.includes(data.user.email?.toLowerCase() || '')) {
         await supabase.auth.signOut();
         setError("Administrators must log in through the Admin Portal.");
         setLoggingIn(false);
         return;
      }
    }
    
    setLoggingIn(false);
  };


  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // If already logged in, redirect to account
  if (user) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white border border-black/5 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <SectionLabel className="justify-center">Welcome Back</SectionLabel>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mt-2">Sign In</h1>
          <p className="text-zinc-500 text-sm mt-2 font-light">
            Access your saved donations, event registrations, and profile.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}



        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loggingIn}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                placeholder="you@example.com" 
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loggingIn}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(15,110,110,0.3)] disabled:opacity-50 disabled:shadow-none"
          >
            {loggingIn ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
