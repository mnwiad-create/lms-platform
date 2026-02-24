import { type ReactNode } from 'react';
import { AuditorSidebar } from './auditor-sidebar';
import { AuditorHeader } from './auditor-header';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

interface AuditorLayoutProps {
  children: ReactNode;
}

export function AuditorLayout({ children }: AuditorLayoutProps) {
  const { sidebarCollapsed, sidebarMobileOpen, setSidebarMobileOpen } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile backdrop */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      {/* Auditor Sidebar */}
      <AuditorSidebar />

      {/* Main content */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        )}
      >
        <AuditorHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
