// Toast notification component
// Shows temporary messages for user feedback (success, error, info)

import { useEffect, useState, useCallback } from 'react';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

let toastListeners: ((msg: Omit<ToastMessage, 'id' | 'exiting'>) => void)[] = [];
let toastIdCounter = 0;

// Global function to show a toast from anywhere
export function showToast(text: string, type: 'success' | 'error' | 'info' = 'info') {
  toastListeners.forEach(fn => fn({ text, type }));
}

export default function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addMessage = useCallback((msg: Omit<ToastMessage, 'id' | 'exiting'>) => {
    const id = ++toastIdCounter;
    setMessages(prev => [...prev, { ...msg, id }]);
    // Auto-remove after 3.5 seconds
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, exiting: true } : m));
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== id));
      }, 300);
    }, 3500);
  }, []);

  useEffect(() => {
    toastListeners.push(addMessage);
    return () => {
      toastListeners = toastListeners.filter(fn => fn !== addMessage);
    };
  }, [addMessage]);

  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm" role="alert" aria-live="polite">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium
            ${msg.exiting ? 'toast-exit' : 'toast-enter'}
            ${msg.type === 'success' ? 'bg-success' : ''}
            ${msg.type === 'error' ? 'bg-danger' : ''}
            ${msg.type === 'info' ? 'bg-secondary' : ''}
          `}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
