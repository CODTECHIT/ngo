import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router';
import { supabase } from '../../../lib/supabase';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { user, loading, isAdmin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rate limiting state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldownTime > 0) return;
    
    setLoggingIn(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setCooldownTime(60);
        setError("Too many failed attempts. Please wait 60 seconds before trying again.");
      } else {
        setError(signInError.message);
      }
    } else {
      setFailedAttempts(0);
    }
    
    setLoggingIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // If already logged in and admin, redirect to dashboard
  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 font-['Lato']">
      <div className="w-full max-w-md bg-white border border-black/5 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-6 shadow-md border border-black/5">
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover scale-[1.35]" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Admin Portal</h1>
          <p className="text-zinc-500 text-sm">
            Sign in with your administrator credentials.
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
                disabled={cooldownTime > 0 || loggingIn}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                placeholder="admin@example.com" 
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
                disabled={cooldownTime > 0 || loggingIn}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cooldownTime > 0 || loggingIn}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(15,110,110,0.3)] disabled:opacity-50 disabled:shadow-none"
          >
            {loggingIn ? (
              <Loader2 className="animate-spin" size={20} />
            ) : cooldownTime > 0 ? (
              `Try again in ${cooldownTime}s`
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
