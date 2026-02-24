import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getQuiz } from '@/lib/api';
import type { Quiz, Question } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function QuizTaking() {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!quizId) return;

    async function load() {
      setIsLoading(true);
      try {
        const data = await getQuiz(quizId!);
        if (data) {
          setQuiz(data);
          const limitSeconds = (data.timeLimit ?? 30) * 60;
          setTimeRemaining(limitSeconds);
        }
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [quizId]);

  // Countdown timer
  useEffect(() => {
    if (!quiz || isSubmitted || isLoading) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quiz, isSubmitted, isLoading]);

  function handleSelectChoice(questionId: string, choiceIndex: number) {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: [choiceIndex],
    }));
  }

  function handleSubmit() {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitted(true);
  }

  function isQuestionCorrect(question: Question): boolean {
    const selected = selectedAnswers[question.id] ?? [];
    const correct = question.config.correctIndices;
    if (selected.length !== correct.length) return false;
    return [...correct].sort().every((v, i) => v === [...selected].sort()[i]);
  }

  function calculateScore(): { earned: number; total: number; percentage: number } {
    if (!quiz?.questions) return { earned: 0, total: 0, percentage: 0 };
    const total = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const earned = quiz.questions.reduce((sum, q) => (isQuestionCorrect(q) ? sum + q.points : sum), 0);
    const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;
    return { earned, total, percentage };
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 p-6">
        <AlertTriangle className="h-12 w-12 text-amber-400" />
        <p className="text-slate-600 font-medium">Quiz not found.</p>
        <Button variant="outline" onClick={() => navigate(`/student/courses/${courseId}`)}>
          Back to Course
        </Button>
      </div>
    );
  }

  const questions = quiz.questions ?? [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const timeLimitSeconds = (quiz.timeLimit ?? 30) * 60;
  const timeIsLow = timeRemaining < 60 && timeRemaining > 0;

  // Results screen
  if (isSubmitted) {
    const { earned, total, percentage } = calculateScore();
    const isPassed = percentage >= quiz.passingScore;

    return (
      <div className="min-h-full bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Score Card */}
          <Card className="mb-6 overflow-hidden">
            <div className={cn('h-2', isPassed ? 'bg-emerald-500' : 'bg-red-500')} />
            <CardContent className="p-6 text-center">
              <div
                className={cn(
                  'inline-flex h-20 w-20 items-center justify-center rounded-full mb-4',
                  isPassed ? 'bg-emerald-100' : 'bg-red-100'
                )}
              >
                {isPassed ? (
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {isPassed ? 'Congratulations!' : 'Better luck next time'}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                {isPassed
                  ? 'You passed the quiz successfully.'
                  : `You need ${quiz.passingScore}% to pass. Keep studying and try again.`}
              </p>

              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">{percentage}%</p>
                  <p className="text-xs text-slate-500 mt-0.5">Your score</p>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">{quiz.passingScore}%</p>
                  <p className="text-xs text-slate-500 mt-0.5">Passing score</p>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">
                    {earned}/{total}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Points earned</p>
                </div>
              </div>

              <Badge
                className={cn(
                  'text-sm px-4 py-1',
                  isPassed ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'
                )}
              >
                {isPassed ? 'PASSED' : 'FAILED'}
              </Badge>
            </CardContent>
          </Card>

          {/* Question Review */}
          {quiz.showResultsAfter && (
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Question Review</h3>
              {questions.map((question, index) => {
                const selected = selectedAnswers[question.id] ?? [];
                const correct = isQuestionCorrect(question);

                return (
                  <Card key={question.id} className={cn('border', correct ? 'border-emerald-200' : 'border-red-200')}>
                    <CardHeader className="pb-3 pt-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('mt-0.5 shrink-0', correct ? 'text-emerald-500' : 'text-red-500')}>
                          {correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-400 mb-0.5">Question {index + 1}</p>
                          <CardTitle className="text-sm font-medium text-slate-900 leading-relaxed">
                            {question.questionEn}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {question.points} pts
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-2 ml-8">
                        {question.config.choices.map((choice, choiceIndex) => {
                          const isSelected = selected.includes(choiceIndex);
                          const isCorrectChoice = question.config.correctIndices.includes(choiceIndex);

                          return (
                            <div
                              key={choiceIndex}
                              className={cn(
                                'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                                isCorrectChoice && 'bg-emerald-50 border border-emerald-200',
                                isSelected && !isCorrectChoice && 'bg-red-50 border border-red-200',
                                !isSelected && !isCorrectChoice && 'bg-slate-50 border border-slate-200'
                              )}
                            >
                              <div
                                className={cn(
                                  'h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0',
                                  isCorrectChoice ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300',
                                  isSelected && !isCorrectChoice ? 'border-red-500 bg-red-500' : ''
                                )}
                              >
                                {(isCorrectChoice || (isSelected && !isCorrectChoice)) && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  'text-xs',
                                  isCorrectChoice ? 'text-emerald-700 font-medium' : 'text-slate-700',
                                  isSelected && !isCorrectChoice ? 'text-red-700' : ''
                                )}
                              >
                                {choice.text_en}
                              </span>
                              {isCorrectChoice && (
                                <span className="ml-auto text-xs text-emerald-600 font-medium">Correct</span>
                              )}
                              {isSelected && !isCorrectChoice && (
                                <span className="ml-auto text-xs text-red-600">Your answer</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {question.config.explanation_en && (
                        <div className="mt-3 ml-8 p-3 rounded-md bg-blue-50 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-700 mb-0.5">Explanation</p>
                          <p className="text-xs text-blue-600">{question.config.explanation_en}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate(`/student/courses/${courseId}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  // Quiz Taking Screen
  return (
    <div className="min-h-full bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Quiz Header */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-base font-semibold text-slate-900">{quiz.titleEn}</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-semibold',
                  timeIsLow
                    ? 'bg-red-100 text-red-700 animate-pulse'
                    : 'bg-slate-100 text-slate-700'
                )}
              >
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{answeredCount} of {totalQuestions} answered</span>
                <span>{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">
                  {currentQuestionIndex + 1}
                </div>
                <CardTitle className="text-base font-medium text-slate-900 leading-relaxed">
                  {currentQuestion.questionEn}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 ml-10 mt-1">
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.points} points
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Single choice
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2.5 ml-0">
                {currentQuestion.config.choices.map((choice, choiceIndex) => {
                  const isSelected = (selectedAnswers[currentQuestion.id] ?? []).includes(choiceIndex);

                  return (
                    <button
                      key={choiceIndex}
                      onClick={() => handleSelectChoice(currentQuestion.id, choiceIndex)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all',
                        isSelected
                          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                      )}
                    >
                      <div
                        className={cn(
                          'h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        )}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span
                        className={cn(
                          'text-sm transition-colors',
                          isSelected ? 'text-blue-700 font-medium' : 'text-slate-700'
                        )}
                      >
                        {choice.text_en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((i) => i - 1)}
            className="flex items-center gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {/* Question dots */}
          <div className="flex items-center gap-1.5">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(i)}
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  i === currentQuestionIndex
                    ? 'bg-blue-600 w-4'
                    : selectedAnswers[q.id]
                    ? 'bg-blue-300'
                    : 'bg-slate-300'
                )}
                aria-label={`Question ${i + 1}`}
              />
            ))}
          </div>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentQuestionIndex((i) => i + 1)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Submit Quiz
            </Button>
          )}
        </div>

        {/* Unanswered warning if trying to submit */}
        {answeredCount < totalQuestions && currentQuestionIndex === totalQuestions - 1 && (
          <p className="text-center text-xs text-amber-600 mt-3 flex items-center justify-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            {totalQuestions - answeredCount} question(s) unanswered. You can still submit.
          </p>
        )}
      </div>
    </div>
  );
}
