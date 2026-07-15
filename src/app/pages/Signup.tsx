import { useState } from 'react';
import { usePublicAuth } from '../contexts/PublicAuthContext';
import { Navigate, Link } from 'react-router';
import { supabase } from '../../lib/supabase';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SectionLabel } from '../components/Layout';
import { motion } from 'motion/react';

export default function Signup() {
  const { user, loading } = usePublicAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSigningUp(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
    }
    
    setSigningUp(false);
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/account',
      },
    });
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
          <SectionLabel className="justify-center">Join Us</SectionLabel>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mt-2">Create Account</h1>
          <p className="text-zinc-500 text-sm mt-2 font-light">
            Become a part of our community to track your impact.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Check your email</h3>
            <p className="text-zinc-500 text-sm mb-6">
              We've sent a verification link to {email}. Please verify your email to log in.
            </p>
            <Link to="/login" className="w-full text-center block px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleSignup}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-black/10 hover:bg-black/5 text-zinc-900 font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-black/10"></div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">or sign up with email</span>
              <div className="flex-1 h-px bg-black/10"></div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={signingUp}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                    placeholder="John Doe" 
                  />
                </div>
              </div>

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
                    disabled={signingUp}
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
                    disabled={signingUp}
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={signingUp}
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={signingUp}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(15,110,110,0.3)] disabled:opacity-50 disabled:shadow-none"
              >
                {signingUp ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
