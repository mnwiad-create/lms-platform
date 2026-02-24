import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  BookOpen,
  Plus,
  Search,
  Users,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Course {
  id: string;
  titleEn: string;
  descriptionEn: string;
  category: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  enrollmentCount: number;
  lessonCount: number;
}

const courses: Course[] = [
  {
    id: '1',
    titleEn: 'Onboarding Program',
    descriptionEn: 'Complete guide for new employees joining the organization',
    category: 'Compliance',
    status: 'PUBLISHED',
    enrollmentCount: 45,
    lessonCount: 12,
  },
  {
    id: '2',
    titleEn: 'Cybersecurity Basics',
    descriptionEn: 'Essential cybersecurity practices for all employees',
    category: 'Technical',
    status: 'PUBLISHED',
    enrollmentCount: 38,
    lessonCount: 8,
  },
  {
    id: '3',
    titleEn: 'Leadership Skills',
    descriptionEn: 'Developing leadership capabilities for managers',
    category: 'Leadership',
    status: 'PUBLISHED',
    enrollmentCount: 22,
    lessonCount: 10,
  },
  {
    id: '4',
    titleEn: 'Project Management 101',
    descriptionEn: 'Fundamentals of project management methodology',
    category: 'Technical',
    status: 'DRAFT',
    enrollmentCount: 0,
    lessonCount: 15,
  },
  {
    id: '5',
    titleEn: 'Data Analytics Fundamentals',
    descriptionEn: 'Introduction to data analysis and visualization',
    category: 'Technical',
    status: 'PUBLISHED',
    enrollmentCount: 31,
    lessonCount: 9,
  },
  {
    id: '6',
    titleEn: 'Customer Service Excellence',
    descriptionEn: 'Best practices for exceptional customer interactions',
    category: 'Soft Skills',
    status: 'PUBLISHED',
    enrollmentCount: 28,
    lessonCount: 7,
  },
  {
    id: '7',
    titleEn: 'Compliance Training',
    descriptionEn: 'Annual compliance and regulatory requirements',
    category: 'Compliance',
    status: 'PUBLISHED',
    enrollmentCount: 52,
    lessonCount: 6,
  },
  {
    id: '8',
    titleEn: 'Effective Communication',
    descriptionEn: 'Improving workplace communication skills',
    category: 'Soft Skills',
    status: 'ARCHIVED',
    enrollmentCount: 15,
    lessonCount: 8,
  },
];

const categoryColors: Record<string, string> = {
  Compliance: 'bg-blue-50 text-blue-700',
  Technical: 'bg-violet-50 text-violet-700',
  Leadership: 'bg-amber-50 text-amber-700',
  'Soft Skills': 'bg-emerald-50 text-emerald-700',
};

const thumbnailColors: Record<string, string> = {
  Compliance: 'bg-blue-100',
  Technical: 'bg-violet-100',
  Leadership: 'bg-amber-100',
  'Soft Skills': 'bg-emerald-100',
};

const thumbnailIconColors: Record<string, string> = {
  Compliance: 'text-blue-500',
  Technical: 'text-violet-500',
  Leadership: 'text-amber-500',
  'Soft Skills': 'text-emerald-500',
};

function StatusBadge({ status }: { status: Course['status'] }) {
  if (status === 'PUBLISHED') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Published
      </span>
    );
  }
  if (status === 'DRAFT') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      Archived
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colorClass = categoryColors[category] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      {category}
    </span>
  );
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

function CourseCard({ course, onClick }: CourseCardProps) {
  const thumbBg = thumbnailColors[course.category] ?? 'bg-gray-100';
  const iconColor = thumbnailIconColors[course.category] ?? 'text-gray-400';

  return (
    <Card
      className="flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 border border-border"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className={`h-36 ${thumbBg} flex items-center justify-center flex-shrink-0`}>
        <BookOpen className={`h-12 w-12 ${iconColor} opacity-60`} />
      </div>

      {/* Body */}
      <CardContent className="flex flex-col flex-1 p-4 gap-3">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={course.category} />
          <StatusBadge status={course.status} />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2">
          {course.titleEn}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {course.descriptionEn}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 py-3 border-t border-border bg-muted/30 flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {course.enrollmentCount} enrolled
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          {course.lessonCount} lessons
        </span>
      </CardFooter>
    </Card>
  );
}

export function CoursesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = courses.filter((c) => {
    const matchesSearch = c.titleEn.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your learning content
          </p>
        </div>
        <Button className="self-start sm:self-auto" onClick={() => {}}>
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Leadership">Leadership</SelectItem>
            <SelectItem value="Compliance">Compliance</SelectItem>
            <SelectItem value="Soft Skills">Soft Skills</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'course' : 'courses'} found
        </p>
      </div>

      {/* Course Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => navigate(`/admin/courses/${course.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-1">No courses found</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
