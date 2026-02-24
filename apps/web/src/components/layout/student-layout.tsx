import { type ReactNode } from 'react';
import { StudentSidebar } from './student-sidebar';
import { StudentHeader } from './student-header';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

interface StudentLayoutProps {
  children: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
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

      {/* Student Sidebar */}
      <StudentSidebar />

      {/* Main content */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          // On desktop, offset by sidebar width (sidebar has 4px left border, so effectively same widths)
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        )}
      >
        <StudentHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
