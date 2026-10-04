// Header component - shared across all pages
// Shows logo, search, cart counter, login/account link
// TODO SUPABASE: No changes needed at launch

import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCartCount, logoutUser } from '../db';
import { subscribeToCart } from '../cartEvents';
import { SITE_NAME } from '../config';
import type { User as UserType } from '../data';

interface HeaderProps {
  session: UserType | null;
  setSession: (user: UserType | null) => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export default function Header({ session, setSession, showSearch, onSearch, searchValue }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCount = () => {
      getCartCount().then(setCartCount);
    };
    updateCount();
    // Subscribe to cart change events for instant updates
    const unsubscribe = subscribeToCart(updateCount);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-lg text-secondary hidden sm:block">{SITE_NAME}</span>
          </Link>

          {/* Search bar (shown in header on larger screens) */}
          {showSearch && onSearch && (
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue || ''}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  aria-label="Search products"
                />
              </div>
            </div>
          )}

          {/* Right side: Cart + Auth */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Hi, <span className="font-medium text-gray-900">{session.name.split(' ')[0]}</span>
                </span>
                {session.role === 'seller' && (
                  <Link
                    to="/seller-dashboard"
                    className="text-sm px-3 py-1.5 bg-secondary text-white rounded-lg hover:bg-secondary-light transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
