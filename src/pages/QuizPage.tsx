import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Target, 
  Award, 
  BookOpen, 
  Users, 
  TrendingUp,
  Play,
  Timer,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { quizAPI } from '@/lib/api';
import { toast } from '@/components/ui/sonner';
import { SUBJECTS_BY_DEPT_YEAR } from '@/data/subjects';

interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  timeTaken: number;
  results: Array<{
    questionId: number;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }>;
  performance: string;
}

const QuizPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Get all CSE subjects with year information
  const cseSubjects = [
    ...SUBJECTS_BY_DEPT_YEAR.cse['1st-year'].map(subject => ({ ...subject, year: '1st Year' })),
    ...SUBJECTS_BY_DEPT_YEAR.cse['2nd-year'].map(subject => ({ ...subject, year: '2nd Year' })),
    ...SUBJECTS_BY_DEPT_YEAR.cse['3rd-year'].map(subject => ({ ...subject, year: '3rd Year' })),
    ...SUBJECTS_BY_DEPT_YEAR.cse['4th-year'].map(subject => ({ ...subject, year: '4th Year' }))
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [quizStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = async (subjectId: string) => {
    try {
      setLoading(true);
      const response = await quizAPI.generateQuiz(subjectId);
      
      if (response.success) {
        setCurrentSubject(subjectId);
        setQuestions(response.data.questions);
        setQuizStarted(true);
        setCurrentQuestion(0);
        setAnswers(new Array(response.data.questions.length).fill(-1));
        setTimeLeft(20 * 60);
        toast.success(`Quiz started for ${cseSubjects.find(s => s.id === subjectId)?.name}!`);
      } else {
        toast.error('Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setLoading(true);
      const timeTaken = 20 * 60 - timeLeft; // Time taken in seconds
      
      const response = await quizAPI.submitQuiz({
        subjectId: currentSubject!,
        answers,
        timeTaken
      });

      if (response.success) {
        setQuizResult(response.data);
        setQuizStarted(false);
        toast.success(`Quiz completed! Score: ${response.data.score}%`);
      } else {
        toast.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentSubject(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(20 * 60);
    setQuizResult(null);
  };

  if (quizResult) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto p-8 glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20">
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-primary">
                  {quizResult.score >= 80 ? (
                    <Award className="w-12 h-12 text-white" />
                  ) : (
                    <Target className="w-12 h-12 text-white" />
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
                <p className="text-xl text-muted-foreground">
                  {cseSubjects.find(s => s.id === currentSubject)?.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{quizResult.score}%</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">{quizResult.correctAnswers}/{quizResult.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">+{quizResult.xpEarned}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </Card>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Performance Analysis</h3>
                <div className="space-y-4">
                  {quizResult.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        {result.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-medium">Question {result.questionId}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.isCorrect ? 'Correct' : `Incorrect (Answer: ${result.correctAnswer + 1})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={resetQuiz} variant="outline">
                  Take Another Quiz
                </Button>
                <Button onClick={() => navigate('/dashboard')} className="bg-gradient-primary">
                  Go to Dashboard
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (quizStarted) {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Quiz Header */}
            <Card className="mb-8 p-6 glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {cseSubjects.find(s => s.id === currentSubject)?.name}
                  </h1>
                  <p className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-red-500" />
                    <span className="text-xl font-bold text-red-500">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </Card>

            {/* Question */}
            <Card className="mb-8 p-8 glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20">
              <h2 className="text-xl font-bold mb-6">{question?.question}</h2>
              <div className="space-y-4">
                {question?.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      answers[currentQuestion] === index
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                      index === currentQuestion
                        ? 'bg-primary text-white'
                        : answers[index] !== -1
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestion === questions.length - 1 ? (
                <Button onClick={handleSubmitQuiz} className="bg-gradient-primary">
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-display font-bold mb-6">
              <span className="gradient-text">CSE Quiz</span> Challenge
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test your knowledge with challenging MCQ quizzes for all CSE subjects across all years. 
              Each quiz has 30 unique questions with a 20-minute time limit.
            </p>
          </div>

          {/* Quiz Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center glass-effect border-2 border-white/10 dark:border-white/20">
              <Target className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">30</div>
              <div className="text-sm text-muted-foreground">Questions per Quiz</div>
            </Card>
            <Card className="p-6 text-center glass-effect border-2 border-white/10 dark:border-white/20">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">20</div>
              <div className="text-sm text-muted-foreground">Minutes Time Limit</div>
            </Card>
            <Card className="p-6 text-center glass-effect border-2 border-white/10 dark:border-white/20">
              <Award className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">30</div>
              <div className="text-sm text-muted-foreground">Max XP per Quiz</div>
            </Card>
            <Card className="p-6 text-center glass-effect border-2 border-white/10 dark:border-white/20">
              <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{cseSubjects.length}</div>
              <div className="text-sm text-muted-foreground">Subjects Available</div>
            </Card>
          </div>

          {/* Subject Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cseSubjects.map((subject, index) => (
              <Card
                key={subject.id}
                className="group p-6 glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {subject.code}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      {subject.year}
                    </Badge>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {subject.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  30 hard MCQ questions • 20 minutes
                </p>
                
                <Button
                  onClick={() => startQuiz(subject.id)}
                  disabled={loading}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;