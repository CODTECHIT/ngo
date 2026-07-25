import { useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '../../lib/supabase';
import { Loader2, Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { SectionLabel } from '../components/Layout';
import { motion } from 'motion/react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-black/5 rounded-3xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <SectionLabel className="justify-center">Account Recovery</SectionLabel>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mt-2 font-['Playfair_Display']">Reset Password</h1>
          <p className="text-zinc-500 text-sm mt-2 font-light font-['Lato']">
            Enter the email address associated with your account and we'll send you a link to reset your password.
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
            <h3 className="text-xl font-bold text-zinc-900 mb-2 font-['Playfair_Display']">Check Your Inbox</h3>
            <p className="text-zinc-500 text-sm mb-6 font-['Lato']">
              We've sent password reset instructions to <span className="font-bold text-zinc-800">{email}</span>. Please click the link in the email to create a new password.
            </p>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-500 text-left mb-6 font-['Lato']">
              <p className="font-bold text-zinc-700 mb-1">Didn't receive an email?</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Wait a few minutes as email delivery can occasionally be delayed</li>
              </ul>
            </div>
            <Link 
              to="/login" 
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(15,110,110,0.3)] font-['Lato']"
            >
              <ArrowLeft size={18} />
              Return to Sign In
            </Link>
          </motion.div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="font-['Lato']">{error}</p>
              </div>
            )}

            <form onSubmit={handleResetRequest} className="space-y-5 font-['Lato']">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/5 border border-black/10 text-zinc-900 text-sm outline-none focus:border-primary/50 focus:bg-black/5 transition-colors disabled:opacity-50"
                    placeholder="you@example.com" 
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(15,110,110,0.3)] disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Recovery Link"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-primary transition-colors font-['Lato']"
              >
                <ArrowLeft size={16} />
                <span>Remembered your password? <strong className="text-primary hover:underline underline-offset-4">Sign in</strong></span>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
