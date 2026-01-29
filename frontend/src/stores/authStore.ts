import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  apiKey: string | null;
  isValidating: boolean;
  error: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  setError: (error: string | null) => void;
  setValidating: (isValidating: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      apiKey: null,
      isValidating: false,
      error: null,
      setApiKey: (key: string) => set({ apiKey: key, error: null }),
      clearApiKey: () => set({ apiKey: null, error: null }),
      setError: (error: string | null) => set({ error }),
      setValidating: (isValidating: boolean) => set({ isValidating }),
    }),
    {
      name: 'spark-auth',
      partialize: (state) => ({ apiKey: state.apiKey }),
    }
  )
);
