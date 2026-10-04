// Directory Section Component
// Shows real verified sellers with direct WhatsApp contact
// Sellers will upload products themselves later
// TODO SUPABASE: No changes needed at launch

import { useState } from 'react';
import { CheckCircle, Code, Tag, Heart, UtensilsCrossed, Wrench, LayoutGrid } from 'lucide-react';

// Seller data type
interface Seller {
  id: number;
  name: string;
  category: 'Web Development' | 'Fashion' | 'Beauty' | 'Food' | 'Services';
  description: string;
  whatsapp: string;
  verified: boolean;
}

// Real verified sellers
const sellers: Seller[] = [
  {
    id: 2,
    name: "Vector Codes",
    category: 'Web Development',
    description: 'Build standard websites.',
    whatsapp: '2347084547988',
    verified: true,
  },
  {
    id: 3,
    name: "Egbeike Precious Chukwuebuka",
    category: 'Fashion',
    description: 'Quality Kaftans, Scrubs, Shirts & Trousers for ABSU students.',
    whatsapp: '2349047587912',
    verified: true,
  },
  {
    id: 4,
    name: "Uchechukwu Divine Chidiamara",
    category: 'Beauty',
    description: 'Oil perfumes & professional nail tech services. Look and smell amazing on campus!',
    whatsapp: '2347013519900',
    verified: true,
  },
  {
    id: 5,
    name: "Udo Favour Chinoyeremu",
    category: 'Fashion',
    description: "Women's wear, shoes, bags, men's wear and jewelry. Public Health 100lvl.",
    whatsapp: '2347064580909',
    verified: true,
  },
];

const allCategories = ['All', ...Array.from(new Set(sellers.map(s => s.category)))];

function getBadgeClass(category: string): string {
  switch (category) {
    case 'Food': return 'bg-orange-100 text-orange-700';
    case 'Services': return 'bg-purple-100 text-purple-700';
    case 'Web Development': return 'bg-blue-100 text-blue-700';
    case 'Fashion': return 'bg-pink-100 text-pink-700';
    case 'Beauty': return 'bg-rose-100 text-rose-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Web Development':
      return <Code className="w-4 h-4" />;
    case 'Fashion':
      return <Tag className="w-4 h-4" />;
    case 'Beauty':
      return <Heart className="w-4 h-4" />;
    case 'Food':
      return <UtensilsCrossed className="w-4 h-4" />;
    case 'Services':
      return <Wrench className="w-4 h-4" />;
    default:
      return null;
  }
}

function getFilterIcon(category: string) {
  if (category === 'All') {
    return <LayoutGrid className="w-4 h-4" />;
  }
  return getCategoryIcon(category);
}

export default function Directory() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filteredSellers = activeCategory === 'All' ? sellers : sellers.filter(s => s.category === activeCategory);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Marketplace
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Current Verified Sellers
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Browse our handpicked list of trusted student sellers. Every vendor has been personally verified.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {allCategories.map((category) => {
            const isActive = activeCategory === category;
            const count = category === 'All' ? sellers.length : sellers.filter(s => s.category === category).length;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold
                  transition-all duration-200 border
                  ${isActive
                    ? 'bg-secondary text-white border-secondary shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-secondary/30 hover:text-secondary'
                  }
                `}
              >
                {getFilterIcon(category)}
                <span>{category}</span>
                <span className={`
                  ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
                `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredSellers.length}</span>{' '}
            {filteredSellers.length === 1 ? 'seller' : 'sellers'}
            {activeCategory !== 'All' && (
              <span> in <span className="font-semibold text-gray-900">{activeCategory}</span></span>
            )}
          </p>
        </div>

        {/* Seller Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSellers.map((seller) => (
            <article
              key={seller.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card Header with gradient accent */}
              <div className="h-2 bg-gradient-to-r from-secondary to-blue-600"></div>

              <div className="p-5">
                {/* Top row: Category badge + Verified badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(seller.category)}`}>
                    {getCategoryIcon(seller.category)}
                    {seller.category}
                  </span>

                  {seller.verified && (
                    <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-[10px] font-bold text-green-700 uppercase">Verified</span>
                    </div>
                  )}
                </div>

                {/* Seller Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 break-words">
                  {seller.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {seller.description}
                </p>

                {/* WhatsApp Contact Button */}
                <a
                  href={`https://wa.me/${seller.whatsapp}?text=${encodeURIComponent(`Hi! 👋 I found your listing on ABSU Marketplace.\n\nI'm interested in "${seller.name}" (${seller.category}).\n\nCan you tell me more about what you offer? 🙏`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl text-sm hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contact via WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredSellers.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No sellers in this category yet.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon or try another category.</p>
          </div>
        )}

        {/* Bottom note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More sellers are being verified. Check back soon!
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
