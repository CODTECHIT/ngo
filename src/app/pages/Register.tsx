import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ fname, lname, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-zinc-950 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Join Us</h2>
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">First Name</label>
              <input type="text" value={fname} onChange={e => setFname(e.target.value)} required className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Last Name</label>
              <input type="text" value={lname} onChange={e => setLname(e.target.value)} required className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 rounded-xl transition-colors mt-6">
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-zinc-500 text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
