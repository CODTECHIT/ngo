import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { user, loading, isAdmin, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/ngo/login" replace />;
  }

  if (!isAdmin) {
    // If not an admin, we should immediately sign them out and show access denied.
    // However, calling logout() during render is bad practice, so we just show an error.
    // For a cleaner UX, we show the message with a button to return to home/logout.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-black/5 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Access Denied</h1>
          <p className="text-zinc-600 mb-8">
            Your email address ({user.email}) is not authorized to access the admin panel.
          </p>
          <button 
            onClick={() => {
              logout();
            }}
            className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
