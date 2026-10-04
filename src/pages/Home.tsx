// Home Page - Main marketplace page
// Shows hero, categories, product grid with search/filter
// Only shows products passing the VISIBILITY RULE
// TODO SUPABASE: No changes needed at launch

import { useEffect, useState, useCallback } from 'react';
import { Search, CheckCircle, ShoppingBag, Shield, Truck, MessageCircle, ArrowUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductModal from '../components/ProductModal';
import Directory from '../components/Directory';
import { getApprovedProducts, getUserById } from '../db';
import { CATEGORIES } from '../config';
import type { Product, User } from '../data';

// Category icons (emoji)
const CATEGORY_ICONS: Record<string, string> = {
  All: '🛍️',
  Fashion: '👗',
  Food: '🍛',
  Textbooks: '📚',
  Electronics: '📱',
  Services: '💼',
};

interface HomeProps {
  session: User | null;
  setSession: (user: User | null) => void;
}

export default function Home({ session, setSession }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Record<string, User>>({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await getApprovedProducts({
      search: search || undefined,
      category: category || undefined,
    });
    setProducts(data);

    // Load seller info for each product
    const sellerMap: Record<string, User> = {};
    for (const p of data) {
      if (!sellerMap[p.seller_id]) {
        const seller = await getUserById(p.seller_id);
        if (seller) sellerMap[p.seller_id] = seller;
      }
    }
    setSellers(sellerMap);
    setLoading(false);
  }, [search, category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header
        session={session}
        setSession={setSession}
        showSearch={true}
        onSearch={handleSearch}
        searchValue={search}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight">
              Stop Getting Scammed.<br />
              <span className="text-yellow-200">Buy from Verified ABSU Students.</span>
            </h1>
            <p className="text-white/80 mb-6 text-sm md:text-base max-w-xl mx-auto">
              The only marketplace where every seller is a real, verified ABSU student.
              No fake products. No ghost vendors. Just safe campus trading.
            </p>

            {/* Hero search */}
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="What are you looking for?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full text-gray-900 text-sm shadow-lg focus:ring-2 focus:ring-white outline-none"
                aria-label="Search products"
              />
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-success" />
                Verified Sellers Only
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-success" />
                Admin-Approved Products
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-success" />
                Campus Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-success" />
                WhatsApp Ordering
              </span>
            </div>
          </div>
        </section>

        {/* Directory Section - Real Verified Sellers */}
        <Directory />

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Browse & Search</h3>
              <p className="text-xs text-gray-500">Find products from verified ABSU students across 5 categories.</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Verified Sellers</h3>
              <p className="text-xs text-gray-500">Every seller is a real ABSU student, approved by our admin team.</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Order via WhatsApp</h3>
              <p className="text-xs text-gray-500">Checkout sends your order directly via WhatsApp for fast confirmation.</p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setCategory('')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !category ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{CATEGORY_ICONS.All}</span> All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{CATEGORY_ICONS[cat]}</span> {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {category || 'All'} Products
              {search && <span className="text-sm font-normal text-gray-500 ml-2">matching "{search}"</span>}
            </h2>
            <span className="text-sm text-gray-500">{products.length} items</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-sm text-gray-500">
                {search ? `No products match "${search}".` : 'No products in this category yet.'}
                {' '}Try a different search or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  seller={sellers[product.seller_id]}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          seller={sellers[selectedProduct.seller_id] || null}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Product Card sub-component
function ProductCard({ product, seller, onClick }: { product: Product; seller?: User; onClick: () => void }) {
  const isVerified = seller?.status === 'verified';

  return (
    <button
      onClick={onClick}
      className="product-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 text-left w-full"
      aria-label={`View ${product.name}, ₦${product.price.toLocaleString()}`}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-tight">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-primary">
          ₦{product.price.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-xs text-gray-500 truncate">{seller?.name || 'Seller'}</span>
          {isVerified && (
            <span className="flex items-center gap-0.5 text-[10px] text-success font-medium shrink-0">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
