import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Desktop sidebar collapsed state (persisted across sessions)
  sidebarCollapsed: boolean;
  // Mobile sidebar overlay state (reset on page load)
  sidebarMobileOpen: boolean;
  // Derived convenience field: true when sidebar is NOT collapsed
  sidebarOpen: boolean;
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      sidebarOpen: true, // inverse of sidebarCollapsed

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
          sidebarOpen: state.sidebarCollapsed, // after toggle: open = was-collapsed
        })),

      setSidebarCollapsed: (sidebarCollapsed) =>
        set({ sidebarCollapsed, sidebarOpen: !sidebarCollapsed }),

      setSidebarMobileOpen: (sidebarMobileOpen) => set({ sidebarMobileOpen }),

      setSidebarOpen: (open: boolean) =>
        set({ sidebarOpen: open, sidebarCollapsed: !open }),
    }),
    {
      name: 'lms-app',
      // Only persist the collapsed preference; mobile state resets each session
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarOpen: state.sidebarOpen,
      }),
    },
  ),
);
