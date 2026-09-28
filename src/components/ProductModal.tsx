// Product Modal - Shows product details when a product card is clicked
// Features: image gallery, quantity selector, add to cart
// Keyboard accessible: focus trap, Escape to close
// TODO SUPABASE: No changes needed at launch

import { useEffect, useRef, useState } from 'react';
import { X, ShoppingCart, CheckCircle } from 'lucide-react';
import { addToCart, getUserById } from '../db';
import { showToast } from './Toast';
import type { Product, User } from '../data';

interface ProductModalProps {
  product: Product;
  seller: User | null;
  onClose: () => void;
}

export default function ProductModal({ product, seller, onClose }: ProductModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    closeButtonRef.current?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleAddToCart = async () => {
    await addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      qty,
      seller_id: product.seller_id,
      image: product.images[0],
    });
    showToast(`${product.name} added to cart!`, 'success');
    onClose();
  };

  const isVerified = seller?.status === 'verified';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Product details: ${product.name}`}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          aria-label="Close product details"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image gallery */}
          <div className="p-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-primary' : 'border-gray-200'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="p-4 flex flex-col">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full w-fit mb-2">
              {product.category}
            </span>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h2>
            
            {/* Seller info */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">
                Sold by: <span className="font-medium">{seller?.name || 'Unknown'}</span>
              </span>
              {isVerified && (
                <span className="flex items-center gap-0.5 text-xs text-success font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>

            <p className="text-2xl font-bold text-primary mb-3">
              ₦{product.price.toLocaleString()}
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
              {product.description}
            </p>

            {/* Quantity selector */}
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-lg font-medium hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x border-gray-200 min-w-[3rem] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 text-lg font-medium hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart — ₦{(product.price * qty).toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
