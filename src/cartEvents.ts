// Cart event system - allows components to notify each other of cart changes
// This ensures the header cart counter updates instantly across all pages
// TODO SUPABASE: No changes needed at launch

type CartEventListener = () => void;

const listeners: Set<CartEventListener> = new Set();

export function notifyCartChanged() {
  listeners.forEach(fn => fn());
}

export function subscribeToCart(listener: CartEventListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
