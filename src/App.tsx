// App.tsx - Main application entry point with routing
// TODO SUPABASE: No changes needed here at launch; routing stays the same

import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { seedIfEmpty, getSession, type User } from './db';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SellerDashboard from './pages/SellerDashboard';
import NotFound from './pages/NotFound';
import Toast from './components/Toast';

function App() {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed data on first load
    seedIfEmpty().then(() => {
      return getSession();
    }).then(user => {
      setSession(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Toast />
      <Analytics />
      <Routes>
        <Route path="/" element={<Home session={session} setSession={setSession} />} />
        <Route path="/cart" element={<Cart session={session} setSession={setSession} />} />
        <Route path="/login" element={<Login setSession={setSession} />} />
        <Route path="/signup" element={<Signup setSession={setSession} />} />
        <Route path="/seller-dashboard" element={<SellerDashboard session={session} setSession={setSession} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
