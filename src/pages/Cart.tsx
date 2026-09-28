// Cart Page - Shows cart items, quantity controls, checkout via WhatsApp
// TODO SUPABASE: No changes needed at launch (cart is client-side)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCart, updateCartQty, removeFromCart, clearCart, createOrder, getUserById } from '../db';
import { WHATSAPP_NUMBER } from '../config';
import { showToast } from '../components/Toast';
import type { CartItem } from '../db';
import type { User } from '../data';

interface CartProps {
  session: User | null;
  setSession: (user: User | null) => void;
}

export default function Cart({ session, setSession }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyerName, setBuyerName] = useState(session?.name || '');
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const cart = await getCart();
    setItems(cart);
    setLoading(false);
  };

  const handleQtyChange = async (productId: string, newQty: number) => {
    const updated = await updateCartQty(productId, newQty);
    setItems(updated);
  };

  const handleRemove = async (productId: string) => {
    const updated = await removeFromCart(productId);
    setItems(updated);
    showToast('Item removed from cart', 'info');
  };

  const grandTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (!buyerName.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }

    // Group items by seller
    const grouped: Record<string, CartItem[]> = {};
    items.forEach(item => {
      if (!grouped[item.seller_id]) grouped[item.seller_id] = [];
      grouped[item.seller_id].push(item);
    });

    // Build WhatsApp message
    let message = `🛒 *New Order - ${SITE_NAME}*\n\n`;
    message += `👤 *Buyer:* ${buyerName}\n\n`;

    let itemNum = 1;
    for (const sellerId of Object.keys(grouped)) {
      const seller = await getUserById(sellerId);
      const sellerName = seller?.name || 'Unknown Seller';
      message += `📦 *From: ${sellerName}*\n`;
      grouped[sellerId].forEach(item => {
        const lineTotal = item.price * item.qty;
        message += `  ${itemNum}. ${item.name} × ${item.qty} = ₦${lineTotal.toLocaleString()}\n`;
        itemNum++;
      });
      message += '\n';
    }

    message += `💰 *Grand Total: ₦${grandTotal.toLocaleString()}*\n\n`;
    message += `Thank you! Please confirm availability and delivery details.`;

    // Save order
    await createOrder({
      buyer_name: buyerName,
      items: items.map(item => ({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        seller_id: item.seller_id,
      })),
      total: grandTotal,
    });

    // Clear cart
    await clearCart();
    setItems([]);
    setShowCheckout(false);

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    showToast('Order placed! Redirecting to WhatsApp...', 'success');
  };

  const SITE_NAME = 'ABSU Marketplace';

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Header session={session} setSession={setSession} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header session={session} setSession={setSession} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mb-6">Browse products and add items to your cart.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.product_id} className="flex gap-3 p-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">₦{item.price.toLocaleString()} each</p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => handleQtyChange(item.product_id, item.qty - 1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={() => handleQtyChange(item.product_id, item.qty + 1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line total + remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          ₦{(item.price * item.qty).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemove(item.product_id)}
                          className="p-1.5 text-gray-400 hover:text-danger transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-gray-900">Grand Total</span>
                <span className="text-2xl font-bold text-primary">₦{grandTotal.toLocaleString()}</span>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3 bg-success text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Checkout via WhatsApp
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="buyer-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      id="buyer-name"
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 py-3 bg-success text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
