import { BookOpen, Users, UserCheck, TrendingUp } from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const stats: StatCard[] = [
  {
    label: 'Total Courses',
    value: '142',
    change: '+12 this month',
    changePositive: true,
    icon: BookOpen,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Active Users',
    value: '2,841',
    change: '+186 this month',
    changePositive: true,
    icon: Users,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Enrollments',
    value: '18,429',
    change: '+3.2% vs last month',
    changePositive: true,
    icon: UserCheck,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    label: 'Completion Rate',
    value: '73.4%',
    change: '-1.8% vs last month',
    changePositive: false,
    icon: TrendingUp,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </p>
            <p
              className={`mt-1 text-xs ${
                stat.changePositive ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Enrollment Activity</h2>
          <div className="flex h-48 items-center justify-center rounded-md bg-muted/40">
            <p className="text-sm text-muted-foreground">Chart will be added here</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Recent Activity</h2>
          <div className="flex flex-col gap-3">
            {['John Smith enrolled in React Fundamentals', 'Mary Johnson completed Node.js Basics', 'Course "AWS Cloud" published', 'New user: David Lee added'].map(
              (item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <p className="text-xs leading-relaxed text-muted-foreground">{item}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
