import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { getCourse, getUserEnrollments } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { mockQuizzes, type Course, type CourseModule, type Lesson } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  FileText,
  Video,
  Clock,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);

  // Find quiz for this course
  const courseQuiz = mockQuizzes.find((q) => q.courseId === courseId) ?? null;

  useEffect(() => {
    if (!courseId) return;

    async function load() {
      setIsLoading(true);
      try {
        const [courseData, enrollments] = await Promise.all([
          getCourse(courseId!),
          user ? getUserEnrollments(user.id) : Promise.resolve([]),
        ]);

        if (courseData) {
          setCourse(courseData);

          // Auto-expand all modules and select first lesson
          const allModuleIds = new Set(courseData.modules?.map((m) => m.id) ?? []);
          setExpandedModules(allModuleIds);

          const firstLesson = courseData.modules?.[0]?.lessons?.[0] ?? null;
          setSelectedLesson(firstLesson);
        }

        // Get enrollment progress for this course
        const enrollment = enrollments.find((e) => e.courseId === courseId);
        if (enrollment) {
          setEnrollmentProgress(enrollment.progressPct);

          // Simulate completed lessons based on progress
          if (courseData) {
            const allLessons = courseData.modules?.flatMap((m) => m.lessons ?? []) ?? [];
            const completedCount = Math.floor((enrollment.progressPct / 100) * allLessons.length);
            const completed = new Set(allLessons.slice(0, completedCount).map((l) => l.id));
            setCompletedLessons(completed);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [courseId, user]);

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  function getTotalDuration(modules: CourseModule[]): number {
    return modules.flatMap((m) => m.lessons ?? []).reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0);
  }

  function getTotalLessons(modules: CourseModule[]): number {
    return modules.flatMap((m) => m.lessons ?? []).length;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <BookOpen className="h-12 w-12 text-slate-300" />
        <p className="text-slate-500">Course not found.</p>
        <Button variant="outline" onClick={() => navigate('/student/courses')}>
          Back to My Courses
        </Button>
      </div>
    );
  }

  const allModules = course.modules ?? [];
  const totalLessons = getTotalLessons(allModules);
  const totalMinutes = getTotalDuration(allModules);

  return (
    <div className="flex flex-col h-full">
      {/* Course Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            to="/student/courses"
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            My Courses
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 truncate">{course.titleEn}</h1>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <BookOpen className="h-3.5 w-3.5" />
                {totalLessons} lessons
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {totalMinutes} min
              </div>
              {course.category && (
                <Badge variant="secondary" className="text-xs">
                  {course.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="text-xs text-slate-500">Your progress</span>
              <div className="flex items-center gap-2">
                <Progress value={enrollmentProgress} className="w-32 h-1.5" />
                <span className="text-xs font-medium text-blue-600">{enrollmentProgress}%</span>
              </div>
            </div>
            {courseQuiz && (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate(`/student/courses/${courseId}/quiz/${courseQuiz.id}`)}
              >
                Take Quiz
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - 2 Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Video + Lesson Content (70%) */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Area */}
          <div className="bg-slate-900 w-full" style={{ aspectRatio: '16/9' }}>
            {selectedLesson?.videoUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-white">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <Play className="h-7 w-7 text-white fill-white ml-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/90">Video Player</p>
                    <p className="text-xs text-white/50 mt-1">Click to play lesson video</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-white/60">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Reading Content</p>
                    <p className="text-xs text-white/40 mt-1">This lesson has no video</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Content */}
          <div className="p-6">
            {selectedLesson ? (
              <div className="max-w-3xl">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{selectedLesson.titleEn}</h2>
                    <div className="flex items-center gap-3 mt-1.5">
                      {selectedLesson.videoUrl ? (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Video className="h-3.5 w-3.5" />
                          Video lesson
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <FileText className="h-3.5 w-3.5" />
                          Reading
                        </div>
                      )}
                      {selectedLesson.durationMinutes && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          {selectedLesson.durationMinutes} min
                        </div>
                      )}
                      {completedLessons.has(selectedLesson.id) && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={completedLessons.has(selectedLesson.id) ? 'outline' : 'default'}
                    className={cn(
                      'shrink-0',
                      !completedLessons.has(selectedLesson.id) && 'bg-blue-600 hover:bg-blue-700 text-white'
                    )}
                    onClick={() => {
                      setCompletedLessons((prev) => {
                        const next = new Set(prev);
                        if (next.has(selectedLesson.id)) {
                          next.delete(selectedLesson.id);
                        } else {
                          next.add(selectedLesson.id);
                        }
                        return next;
                      });
                    }}
                  >
                    {completedLessons.has(selectedLesson.id) ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                </div>

                <Separator className="mb-5" />

                {selectedLesson.contentEn ? (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed">{selectedLesson.contentEn}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No additional content for this lesson.</p>
                )}

                {selectedLesson.fileUrl && (
                  <div className="mt-6 p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                      <FileText className="h-4.5 w-4.5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">Lesson Resource</p>
                      <p className="text-xs text-slate-500 truncate">{selectedLesson.fileUrl}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                )}

                {/* Navigation between lessons */}
                <div className="flex items-center justify-between mt-8">
                  {(() => {
                    const allLessons = allModules.flatMap((m) => m.lessons ?? []);
                    const currentIndex = allLessons.findIndex((l) => l.id === selectedLesson.id);
                    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
                    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

                    return (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!prevLesson}
                          onClick={() => prevLesson && setSelectedLesson(prevLesson)}
                          className="flex items-center gap-1.5"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <span className="text-xs text-slate-400">
                          {currentIndex + 1} / {allLessons.length}
                        </span>
                        <Button
                          variant={nextLesson ? 'default' : 'outline'}
                          size="sm"
                          disabled={!nextLesson}
                          onClick={() => nextLesson && setSelectedLesson(nextLesson)}
                          className={cn(
                            'flex items-center gap-1.5',
                            nextLesson && 'bg-blue-600 hover:bg-blue-700 text-white'
                          )}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-slate-500">Select a lesson from the sidebar to begin.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Module Sidebar (30%) */}
        <div className="hidden lg:flex w-80 xl:w-96 flex-col border-l border-slate-200 bg-white shrink-0">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Course Content</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {completedLessons.size} / {totalLessons} lessons completed
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="py-2">
              {allModules.map((module, moduleIndex) => {
                const isExpanded = expandedModules.has(module.id);
                const moduleLessons = module.lessons ?? [];
                const completedInModule = moduleLessons.filter((l) => completedLessons.has(l.id)).length;

                return (
                  <div key={module.id}>
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-semibold shrink-0">
                        {moduleIndex + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{module.titleEn}</p>
                        <p className="text-xs text-slate-400">
                          {completedInModule}/{moduleLessons.length} lessons
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Lessons */}
                    {isExpanded && (
                      <div className="bg-slate-50/50">
                        {moduleLessons.map((lesson, lessonIndex) => {
                          const isActive = selectedLesson?.id === lesson.id;
                          const isCompleted = completedLessons.has(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={cn(
                                'w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors border-l-2',
                                isActive
                                  ? 'bg-blue-50 border-l-blue-600'
                                  : 'border-l-transparent hover:bg-slate-100'
                              )}
                            >
                              <div className="mt-0.5 shrink-0">
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <Circle
                                    className={cn(
                                      'h-4 w-4',
                                      isActive ? 'text-blue-600' : 'text-slate-300'
                                    )}
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-1">
                                  <span
                                    className={cn(
                                      'text-xs leading-relaxed',
                                      isActive ? 'font-medium text-blue-700' : 'text-slate-700'
                                    )}
                                  >
                                    {lessonIndex + 1}. {lesson.titleEn}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {lesson.videoUrl ? (
                                    <Video className="h-3 w-3 text-slate-400" />
                                  ) : (
                                    <FileText className="h-3 w-3 text-slate-400" />
                                  )}
                                  {lesson.durationMinutes && (
                                    <span className="text-xs text-slate-400">{lesson.durationMinutes} min</span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <Separator className="my-0.5" />
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Quiz CTA in sidebar */}
          {courseQuiz && (
            <div className="p-4 border-t border-slate-200">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <p className="text-xs font-semibold text-blue-800 mb-0.5">{courseQuiz.titleEn}</p>
                  <p className="text-xs text-blue-600 mb-2">
                    {courseQuiz.questions?.length ?? 0} questions &middot; {courseQuiz.timeLimit} min &middot; Pass {courseQuiz.passingScore}%
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    onClick={() => navigate(`/student/courses/${courseId}/quiz/${courseQuiz.id}`)}
                  >
                    Take Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
