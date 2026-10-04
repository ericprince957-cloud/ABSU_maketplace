// Shared Auth Layout - Used by both Login and Signup pages
// Provides consistent branding and navigation
// TODO SUPABASE: No changes needed at launch

import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, Users } from 'lucide-react';
import { SITE_NAME } from '../config';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Top navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Marketplace</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-gray-900 hidden sm:block">{SITE_NAME}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex">
        {/* Left side - Trust indicators (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-secondary text-white p-12 flex-col justify-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">
              Join the Trusted ABSU Marketplace
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Buy and sell safely within your campus community. Every seller is verified.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Verified Sellers Only</h3>
                  <p className="text-sm text-white/70">Every seller is a real ABSU student, approved by our admin team.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Admin-Approved Products</h3>
                  <p className="text-sm text-white/70">All products are reviewed before going live on the marketplace.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Campus Community</h3>
                  <p className="text-sm text-white/70">Connect with fellow students. No strangers, no scams.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-6">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-500">{subtitle}</p>
            </div>

            {/* Form container */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
