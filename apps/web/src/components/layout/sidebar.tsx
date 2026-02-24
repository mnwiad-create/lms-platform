import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
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
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Enrollments', href: '/admin/enrollments', icon: UserCheck },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

function getUserInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatRole(role: string): string {
  return role
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

export function Sidebar() {
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setSidebarMobileOpen } = useAppStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close mobile sidebar on navigation
    setSidebarMobileOpen(false);
  };

  return (
    <aside
      className={cn(
        // Base styles
        'fixed left-0 top-0 z-30 flex h-full flex-col bg-slate-900 text-slate-200 transition-all duration-300',
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
          'flex h-16 shrink-0 items-center border-b border-slate-700/60 px-4',
          sidebarCollapsed && 'lg:justify-center lg:px-0'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span
            className={cn(
              'text-base font-semibold tracking-tight text-white transition-all duration-300',
              sidebarCollapsed && 'lg:hidden'
            )}
          >
            LMS Platform
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
              end={item.href === '/admin'}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
                  sidebarCollapsed && 'lg:justify-center lg:px-0'
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
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
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-slate-700/60">
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
              <AvatarFallback className="bg-blue-600 text-xs text-white">
                {getUserInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                'min-w-0 flex-1 transition-all duration-300',
                sidebarCollapsed && 'lg:hidden'
              )}
            >
              <p className="truncate text-sm font-medium text-slate-100">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-slate-400">
                {formatRole(user.role)}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className={cn(
                'shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100',
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
            className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
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
