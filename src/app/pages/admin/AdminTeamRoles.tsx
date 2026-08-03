import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router';
import { AdminSidebar } from '../../components/AdminSidebar';
import { Users, Shield, Plus, Trash2, CheckCircle, Lock, Mail, User as UserIcon, AlertCircle } from 'lucide-react';
import { supabaseAdmin as supabase } from '../../../lib/supabase';

export interface RBACMember {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'event_manager' | 'admin';
  created_at: string;
}

export default function AdminTeamRoles() {
  const { isSuperAdmin } = useAuth();

  const [members, setMembers] = useState<RBACMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'event_manager' | 'super_admin'>('event_manager');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const defaultSuperEmail = (import.meta as any).env?.VITE_ADMIN_ALLOWED_EMAILS || 'srishreevisionfoundation1@gmail.com';

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    try {
      const stored = localStorage.getItem('ngo_rbac_team_members');
      if (stored) {
        setMembers(JSON.parse(stored));
      } else {
        // Initialize with default sample if empty
        const initial: RBACMember[] = [
          {
            id: 'default-mgr-1',
            name: 'Sample Event Manager',
            email: 'eventmgr@srishreevision.org',
            password: 'EventManager2026',
            role: 'event_manager',
            created_at: new Date().toISOString()
          }
        ];
        localStorage.setItem('ngo_rbac_team_members', JSON.stringify(initial));
        setMembers(initial);
      }
    } catch (e) {
      console.error("Failed to load RBAC members:", e);
    }
  };

  const saveMembers = (newMembers: RBACMember[]) => {
    localStorage.setItem('ngo_rbac_team_members', JSON.stringify(newMembers));
    setMembers(newMembers);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === defaultSuperEmail.toLowerCase()) {
      setError("This email is reserved for the primary foundation Super Admin.");
      return;
    }

    if (members.some(m => m.email.toLowerCase() === normalizedEmail)) {
      setError("A team member with this email/User ID already exists.");
      return;
    }

    const newId = 'rbac_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // Create user in Supabase and ensure their profile has the assigned role
    try {
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://lhmhynwpplzyzkhgshzo.supabase.co';
      const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

      if (supabaseUrl && supabaseKey) {
        const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password: password,
            data: { full_name: name, role: role }
          })
        });
        const authData = await res.json();
        const userId = authData?.user?.id || authData?.id;
        if (userId) {
          await supabase.from('profiles').upsert([
            { id: userId, full_name: name, role: role }
          ]);
        }
      }
    } catch (err) {
      console.warn("Could not reach Supabase REST API:", err);
    }

    const newMember: RBACMember = {
      id: newId,
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: role,
      created_at: new Date().toISOString()
    };

    const updated = [...members, newMember];
    saveMembers(updated);

    setSuccess(`Successfully created rule-based account for ${name}! They can now log in using ${normalizedEmail}.`);
    setName('');
    setEmail('');
    setPassword('');
    setRole('event_manager');
    setIsModalOpen(false);
  };

  const handleDeleteMember = (id: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove access for "${memberName}"? They will no longer be able to log in to the admin panel.`)) {
      const updated = members.filter(m => m.id !== id);
      saveMembers(updated);
      setSuccess(`Removed access for ${memberName}.`);
    }
  };

  if (!isSuperAdmin) {
    return <Navigate to="/admin/ngo/events" replace />;
  }

  return (
    <div className="min-h-screen bg-black/5 flex flex-col md:flex-row font-['Lato']">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-black/5 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <Users className="text-primary" />
              Team & Rule-Based Roles (RBAC)
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Create sub-admin and manager accounts with granular permissions.
            </p>
          </div>
          <button
            onClick={() => { setError(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm text-sm"
          >
            <Plus size={18} />
            Add Rule-Based User
          </button>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-semibold">
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
              {success}
            </div>
          )}

          {/* Rule Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">Super Admin Role</h3>
                  <p className="text-xs text-zinc-500">Unrestricted system authority</p>
                </div>
              </div>
              <ul className="text-xs text-zinc-600 space-y-2 list-disc list-inside">
                <li>Full access to all administrative modules & settings</li>
                <li>Can view financial totals, donation logs and revenue charts</li>
                <li>Can create, edit and remove team member roles</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm border-l-4 border-l-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">Event Manager Role</h3>
                  <p className="text-xs text-zinc-500">Restricted operational access</p>
                </div>
              </div>
              <ul className="text-xs text-zinc-600 space-y-2 list-disc list-inside">
                <li><strong className="text-zinc-900">100% Event Control:</strong> Can create events, edit details, upload banners & certificate templates</li>
                <li><strong className="text-zinc-900">Registrations:</strong> Can check participant counts, export CSVs, broadcast emails, & download certificates</li>
                <li><strong className="text-red-600">Financial Restriction:</strong> Cannot view donation amounts, revenue statistics, or financial dashboards</li>
              </ul>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 flex items-center justify-between">
              <h2 className="font-bold text-zinc-900 text-lg">Active Admin Team Accounts</h2>
              <span className="text-xs text-zinc-500 font-semibold">{members.length + 1} Authorized Account(s)</span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-50 border-b border-black/5">
                <tr>
                  <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">User Name</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">User ID / Email</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Assigned Rule / Role</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">Created At</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {/* Primary Super Admin */}
                <tr className="bg-amber-50/30">
                  <td className="p-4 font-bold text-zinc-900 flex items-center gap-2">
                    <Shield size={16} className="text-amber-600" />
                    Foundation Super Admin
                  </td>
                  <td className="p-4 text-sm font-mono text-zinc-800">{defaultSuperEmail}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                      <Shield size={12} /> Super Admin
                    </span>
                  </td>
                  <td className="p-4 text-xs text-zinc-500">System Protected</td>
                  <td className="p-4 text-right">
                    <span className="text-xs font-semibold text-zinc-400 italic">Primary Account</span>
                  </td>
                </tr>

                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="p-4 font-bold text-zinc-900">{m.name}</td>
                    <td className="p-4 text-sm font-mono text-zinc-800">{m.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${m.role === 'super_admin' || m.role === 'admin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-primary/10 text-primary'
                        }`}>
                        {m.role === 'super_admin' || m.role === 'admin' ? <Shield size={12} /> : <Users size={12} />}
                        {m.role === 'super_admin' || m.role === 'admin' ? 'Super Admin' : 'Event Manager'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-zinc-500">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteMember(m.id, m.name)}
                        className="p-2 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Remove Staff Account"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create RBAC User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-black/5 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-6">
                <h3 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
                  <Users className="text-primary" />
                  Assign Rule-Based Role
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 text-sm font-bold">
                  ✕
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Staff Member Full Name
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. user name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    User ID / Login Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. eventmanager@srishreevision.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Login Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">Share these credentials securely with the staff member.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Select Rule / Role Permission
                  </label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="event_manager">Event Manager (Manage Events & Registrations Only; Hide Revenue)</option>
                    <option value="super_admin">Super Admin (Full Access to Financials & Team Roles)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-zinc-100 text-zinc-600 font-bold rounded-xl text-sm hover:bg-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Assign Role & Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
