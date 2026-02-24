import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Role } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated — send to role-appropriate home
  if (isAuthenticated) {
    let destination = '/admin';
    if (user?.role === Role.STUDENT) destination = '/student';
    else if (user?.role === Role.INSTRUCTOR) destination = '/instructor';
    navigate(destination, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      toast.success('Welcome back!');
      // Get updated user from store after login completes
      const updatedUser = useAuthStore.getState().user;
      let destination = '/admin';
      if (updatedUser?.role === Role.STUDENT) destination = '/student';
      else if (updatedUser?.role === Role.INSTRUCTOR) destination = '/instructor';
      navigate(destination);
    } else {
      toast.error('Invalid email or password');
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-slate-900">LMS Platform</h1>
            <p className="text-sm text-slate-500">Enterprise Learning Management System</p>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  'h-10 rounded-md border border-input bg-background px-3 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-1 focus:ring-ring'
                )}
                placeholder="you@company.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    'h-10 w-full rounded-md border border-input bg-background px-3 pr-10 text-sm',
                    'placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-1 focus:ring-ring'
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'mt-1 flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white',
                'transition-colors hover:bg-blue-700',
                'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-60'
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-center">
          <p className="text-xs text-blue-700">
            Demo: <span className="font-mono font-medium">test@test.com</span> / <span className="font-mono font-medium">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
