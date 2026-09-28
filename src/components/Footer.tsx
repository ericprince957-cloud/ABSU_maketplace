// Footer component
// TODO SUPABASE: No changes needed at launch

import { Link } from 'react-router-dom';
import { SITE_NAME } from '../config';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-3">{SITE_NAME}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              The trusted marketplace for ABSU students. Buy and sell safely within your campus community.
              No more scams — every seller is verified.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/cart" className="text-gray-300 hover:text-primary transition-colors">Cart</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-primary transition-colors">Seller Login</Link></li>
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h3 className="font-bold text-lg mb-3">Why Trust Us?</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ All sellers are verified ABSU students</li>
              <li>✅ Admin-approved products only</li>
              <li>✅ WhatsApp-based ordering for transparency</li>
              <li>✅ Banned sellers can't sell on the platform</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {SITE_NAME}. Built for ABSU students, by ABSU students.
        </div>
      </div>
    </footer>
  );
}
