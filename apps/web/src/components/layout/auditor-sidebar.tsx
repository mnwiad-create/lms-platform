import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/auditor', icon: LayoutDashboard },
  { label: 'Audit Reports', href: '/auditor/reports', icon: FileText },
];

function getUserInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function AuditorSidebar() {
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setSidebarMobileOpen } = useAppStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    setSidebarMobileOpen(false);
  };

  return (
    <aside
      className={cn(
        // Base styles - deep teal background for audit/compliance
        'fixed left-0 top-0 z-30 flex h-full flex-col bg-teal-950 text-teal-100 transition-all duration-300',
        // Desktop width
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-60',
        // Mobile: always full width when open, hidden when closed
        sidebarMobileOpen
          ? 'w-60 translate-x-0'
          : '-translate-x-full lg:translate-x-0',
      )}
    >
      {/* Logo area */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-teal-800/50 px-4',
          sidebarCollapsed && 'lg:justify-center lg:px-0'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span
            className={cn(
              'text-base font-semibold tracking-tight text-white transition-all duration-300',
              sidebarCollapsed && 'lg:hidden'
            )}
          >
            LMS Auditor
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/auditor'}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-teal-300 hover:bg-teal-800/50 hover:text-teal-100',
                  sidebarCollapsed && 'lg:justify-center lg:px-0'
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-teal-400 group-hover:text-teal-200'
                    )}
                  />
                  <span
                    className={cn(
                      'transition-all duration-300',
                      sidebarCollapsed && 'lg:hidden'
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Read-only badge */}
        {!sidebarCollapsed && (
          <div className="mt-4 rounded-md border border-teal-800/50 bg-teal-900/50 px-3 py-2">
            <p className="text-xs font-medium text-teal-400">Read-Only Access</p>
            <p className="mt-0.5 text-xs text-teal-500">View and export data only</p>
          </div>
        )}
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-teal-800/50">
        {/* User info */}
        {user && (
          <div
            className={cn(
              'flex items-center gap-3 px-3 py-3',
              sidebarCollapsed && 'lg:justify-center lg:px-0'
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.firstName} />}
              <AvatarFallback className="bg-teal-600 text-xs text-white font-semibold">
                {getUserInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                'min-w-0 flex-1 transition-all duration-300',
                sidebarCollapsed && 'lg:hidden'
              )}
            >
              <p className="truncate text-sm font-medium text-teal-100">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-teal-400 font-medium">
                Auditor
              </p>
            </div>
            <button
              onClick={handleLogout}
              className={cn(
                'shrink-0 rounded-md p-1.5 text-teal-400 transition-colors hover:bg-red-500/20 hover:text-red-400',
                sidebarCollapsed && 'lg:hidden'
              )}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Collapse toggle button (desktop only) */}
        <div className="hidden px-3 pb-3 lg:block">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-xs text-teal-400 transition-colors hover:bg-teal-800/50 hover:text-teal-200"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
