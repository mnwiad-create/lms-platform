import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockUsers, mockCredentials } from '@/lib/mock-data';
import type { User } from '@/lib/mock-data';

// Simulated network delay for realistic mock API feel
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });
        await delay(350); // Simulate network round-trip

        const credential = mockCredentials.find(
          (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password,
        );

        if (!credential) {
          set({ isLoading: false });
          return false;
        }

        const user = mockUsers.find((u) => u.id === credential.userId) ?? null;

        if (!user) {
          set({ isLoading: false });
          return false;
        }

        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'lms-auth',
      // Only persist the user identity, not loading states
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
