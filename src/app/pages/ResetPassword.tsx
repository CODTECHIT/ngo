import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { Loader2, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionLabel } from '../components/Layout';
import { motion } from 'motion/react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Listen for auth state changes (especially PASSWORD_RECOVERY or SIGNED_IN from URL hash)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setHasSession(true);
      }
      if (event === 'PASSWORD_RECOVERY' || session) {
        setCheckingAuth(false);
      }
    });

    // Check if session is already active
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
        setCheckingAuth(false);
      } else {
        // Wait slightly for URL hash parsing by supabase client
        const timer = setTimeout(() => {
          setCheckingAuth(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter them.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        // Sign out so user logs in cleanly with their new credentials
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-black/5 rounded-3xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <SectionLabel className="justify-center">Account Security</SectionLabel>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mt-2 font-['Playfair_Display']">Set New Password</h1>
          <p className="text-zinc-500 text-sm mt-2 font-light font-['Lato']">
            Please enter and confirm your new strong password below.
          </p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Password Updated!</h3>
            <p className="text-zinc-500 text-sm mb-6 font-['Lato']">
              Your password has been reset successfully. You can now log in to your account with your new credentials.
            </p>
            <Link 
              to="/login" 
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(15,110,110,0.3)] font-['Lato']"
            >
              <span>Sign In Now</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : !hasSession ? (
          <div className="text-center py-6 font-['Lato']">
            <div className="mb-4 p-4 bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl flex items-start gap-3 text-left">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold mb-1">Invalid or Expired Link</p>
                <p>We couldn't verify your recovery session. Password reset links expire after a short period or once used.</p>
              </div>
            </div>
            <Link 
              to="/forgot-password" 
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all text-sm shadow-[0_0_20px_rgba(15,110,110,0.3)] mb-3"
            >
              Request a New Recovery Link
            </Link>
            <Link 
              to="/login" 
              className="block text-sm text-zinc-500 hover:text-primary transition-colors font-bold mt-2"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-3 font-['Lato']">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-5 font-['Lato']">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                    placeholder="At least 6 characters" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                    placeholder="Re-enter password" 
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(15,110,110,0.3)] disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
