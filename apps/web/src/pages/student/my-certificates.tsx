import { useState, useEffect } from 'react';
import { getUserEnrollments } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { mockCourses, type Enrollment, EnrollmentStatusEnum } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Download, Eye, Calendar, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function generateCertificateId(enrollmentId: string): string {
  // Generate a deterministic, readable certificate ID from the enrollment ID
  const hash = enrollmentId
    .replace('enroll-', '')
    .padStart(4, '0');
  return `CERT-2025-${hash.toUpperCase()}`;
}

interface CertificateData {
  enrollment: Enrollment;
  courseTitle: string;
  certificateId: string;
}

export function MyCertificates() {
  const { user } = useAuthStore();
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function load() {
      setIsLoading(true);
      try {
        const enrollments = await getUserEnrollments(user!.id);

        const completed = enrollments
          .filter((e) => e.status === EnrollmentStatusEnum.COMPLETED)
          .map((e) => {
            const course = mockCourses.find((c) => c.id === e.courseId);
            return {
              enrollment: e,
              courseTitle: course?.titleEn ?? 'Unknown Course',
              certificateId: generateCertificateId(e.id),
            };
          });

        setCertificates(completed);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Certificates</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Certificates earned from completed courses
          </p>
        </div>
        {certificates.length > 0 && (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-sm px-3 py-1">
            {certificates.length} certificate{certificates.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Empty State */}
      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
            <Award className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-2">No certificates yet</h3>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            Complete a course to earn your first certificate. Keep learning — you're on your way!
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-6 border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={() => window.location.assign('/student/courses')}
          >
            Browse My Courses
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {certificates.map(({ enrollment, courseTitle, certificateId }) => (
            <CertificateCard
              key={enrollment.id}
              courseTitle={courseTitle}
              completedAt={enrollment.completedAt}
              certificateId={certificateId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CertificateCardProps {
  courseTitle: string;
  completedAt: string | null;
  certificateId: string;
}

function CertificateCard({ courseTitle, completedAt, certificateId }: CertificateCardProps) {
  return (
    <Card className="overflow-hidden border border-slate-200 hover:shadow-md transition-shadow group">
      {/* Certificate Visual Header */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-6">
        {/* Decorative rings */}
        <div className="absolute top-3 right-3 h-16 w-16 rounded-full border border-white/10" />
        <div className="absolute top-1 right-1 h-20 w-20 rounded-full border border-white/10" />

        <div className="relative flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm shrink-0">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-0.5">
              Certificate of Completion
            </p>
            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
              {courseTitle}
            </h3>
          </div>
        </div>

        {/* Certificate ID badge */}
        <div className="mt-4 flex items-center gap-1.5">
          <Shield className="h-3 w-3 text-blue-200 shrink-0" />
          <span className="text-xs font-mono text-blue-200">{certificateId}</span>
        </div>
      </div>

      {/* Certificate Details */}
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 text-slate-500 mb-4">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs">
            Completed on {formatDate(completedAt)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className={cn(
              'flex-1 text-xs flex items-center justify-center gap-1.5',
              'border-slate-200 text-slate-400 cursor-not-allowed'
            )}
            title="Download feature coming soon"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className={cn(
              'flex-1 text-xs flex items-center justify-center gap-1.5',
              'border-slate-200 text-slate-400 cursor-not-allowed'
            )}
            title="View feature coming soon"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-2">
          Download & verification coming soon
        </p>
      </CardContent>
    </Card>
  );
}
