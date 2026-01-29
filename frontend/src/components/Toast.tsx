import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setIsVisible(true);

    // Auto-close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-3 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg transition-all transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-4 hover:opacity-75 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}

// Toast container for managing multiple toasts
interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const toastListeners: Set<(toasts: ToastMessage[]) => void> = new Set();
const toasts: ToastMessage[] = [];

export function showToast(message: string, type: ToastType = 'info') {
  const id = toastId++;
  toasts.push({ id, message, type });
  toastListeners.forEach((listener) => listener([...toasts]));

  // Auto-remove after duration
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
      toastListeners.forEach((listener) => listener([...toasts]));
    }
  }, 5000);
}

export function ToastContainer() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListeners.add(setMessages);
    return () => {
      toastListeners.delete(setMessages);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {messages.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {
            const index = toasts.findIndex((t) => t.id === toast.id);
            if (index !== -1) {
              toasts.splice(index, 1);
              toastListeners.forEach((listener) => listener([...toasts]));
            }
          }}
        />
      ))}
    </div>
  );
}
