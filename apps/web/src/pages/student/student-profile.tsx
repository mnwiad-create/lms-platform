import { useAuthStore } from '@/stores/auth-store';
import { mockOrgUnits, AuthProvider, UserStatus, Role } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Building2,
  ShieldCheck,
  CalendarDays,
  KeyRound,
  ActivitySquare,
} from 'lucide-react';

// Human-readable labels
const roleLabels: Record<Role, string> = {
  [Role.SYSTEM_ADMIN]: 'System Administrator',
  [Role.COURSE_ADMIN]: 'Course Administrator',
  [Role.INSTRUCTOR]: 'Instructor',
  [Role.STUDENT]: 'Student',
  [Role.AUDITOR]: 'Auditor',
};

const authProviderLabels: Record<AuthProvider, string> = {
  [AuthProvider.LOCAL]: 'Email & Password',
  [AuthProvider.LDAP]: 'LDAP / Active Directory',
  [AuthProvider.AZURE_AD]: 'Microsoft Azure AD',
  [AuthProvider.GOOGLE]: 'Google Workspace',
};

const statusConfig: Record<UserStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  [UserStatus.ACTIVE]: { label: 'Active', variant: 'default' },
  [UserStatus.INACTIVE]: { label: 'Inactive', variant: 'secondary' },
  [UserStatus.SUSPENDED]: { label: 'Suspended', variant: 'destructive' },
};

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-800 break-words">{value}</p>
      </div>
    </div>
  );
}

export function StudentProfile() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <p className="text-sm text-muted-foreground">No user data available.</p>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = getInitials(user.firstName, user.lastName);
  const department = user.orgUnitId
    ? mockOrgUnits.find((u) => u.id === user.orgUnitId)?.nameEn ?? 'Unknown Department'
    : 'No Department Assigned';
  const statusInfo = statusConfig[user.status] ?? { label: user.status, variant: 'outline' as const };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          View your account information and details.
        </p>
      </div>

      {/* Profile identity card */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            {/* Avatar */}
            <Avatar className="h-20 w-20 flex-shrink-0 ring-4 ring-blue-100">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-blue-600 text-xl font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Name + role + status */}
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>

              {/* Thai name if available */}
              {(user.firstNameTh || user.lastNameTh) && (
                <p className="text-sm text-slate-500">
                  {[user.firstNameTh, user.lastNameTh].filter(Boolean).join(' ')}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  {roleLabels[user.role] ?? user.role}
                </Badge>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>

              <p className="text-sm text-slate-500">{department}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & department info */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label="Email Address"
              value={user.email}
            />
            <Separator />
            <InfoRow
              icon={<Building2 className="h-4 w-4" />}
              label="Department"
              value={department}
            />
            <Separator />
            <InfoRow
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Role"
              value={roleLabels[user.role] ?? user.role}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account info */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800">
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <InfoRow
              icon={<KeyRound className="h-4 w-4" />}
              label="Sign-in Method"
              value={authProviderLabels[user.authProvider] ?? user.authProvider}
            />
            <Separator />
            <InfoRow
              icon={<ActivitySquare className="h-4 w-4" />}
              label="Account Status"
              value={statusInfo.label}
            />
            <Separator />
            <InfoRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Member Since"
              value={formatDate(user.createdAt)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
