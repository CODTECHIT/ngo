import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import { Calendar, MapPin } from 'lucide-react';
import { Navigate } from 'react-router';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      api.getMyRegistrations()
        .then(res => setRegistrations(res))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (loading) return <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="bg-black/5 border border-black/10 p-8 rounded-3xl shadow-xl mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome, {user.fname}!</h1>
          <p className="text-zinc-600">Email: {user.email} | Role: {user.role}</p>
        </div>

        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Your Registered Events</h2>
        
        {registrations.length === 0 ? (
          <div className="bg-black/5 border border-black/5 rounded-2xl p-10 text-center text-zinc-600">
            You haven't registered for any events yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map(reg => (
              <div key={reg._id} className="bg-white border border-black/10 rounded-2xl p-6 hover:border-primary/50 transition-colors shadow-md hover:shadow-lg">
                <img src={reg.eventId.banner} alt={reg.eventId.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                <h3 className="text-zinc-900 font-bold text-lg mb-2 line-clamp-1">{reg.eventId.title}</h3>
                <div className="flex items-center gap-2 text-zinc-600 text-sm mb-1">
                  <Calendar size={14} className="text-primary" /> {reg.eventId.date}
                </div>
                <div className="flex items-center gap-2 text-zinc-600 text-sm mb-4">
                  <MapPin size={14} className="text-primary" /> {reg.eventId.venue}
                </div>
                <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full inline-block uppercase tracking-wider">
                  Status: {reg.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
