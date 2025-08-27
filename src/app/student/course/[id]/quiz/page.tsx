'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const quizData = {
  1: {
    title: 'React Fundamentals Quiz',
    description: 'Test your understanding of React basics',
    timeLimit: 30, // minutes
    totalQuestions: 10,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: 'What is React?',
        type: 'multiple-choice',
        options: [
          'A JavaScript library for building user interfaces',
          'A database management system',
          'A server-side programming language',
          'A CSS framework'
        ],
        correctAnswer: 0,
        explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, particularly web applications.'
      },
      {
        id: 2,
        question: 'Which of the following is used to create a React component?',
        type: 'multiple-choice',
        options: [
          'function',
          'class',
          'Both function and class',
          'None of the above'
        ],
        correctAnswer: 2,
        explanation: 'React components can be created using both function components and class components.'
      },
      {
        id: 3,
        question: 'What is JSX?',
        type: 'multiple-choice',
        options: [
          'A JavaScript extension',
          'A syntax extension for JavaScript',
          'A new programming language',
          'A CSS preprocessor'
        ],
        correctAnswer: 1,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.'
      }
    ]
  }
}

export default function QuizPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  
  const [quiz, setQuiz] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const quizInfo = quizData[courseId as keyof typeof quizData]
    setQuiz(quizInfo)
    if (quizInfo) {
      setTimeLeft(quizInfo.timeLimit * 60) // Convert to seconds
    }
  }, [courseId])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [quizStarted, quizCompleted, timeLeft])

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    let correctAnswers = 0
    quiz.questions.forEach((question: any) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })
    
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100)
    setScore(finalScore)
    setQuizCompleted(true)
    setShowResults(true)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (status === 'loading' || !quiz) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!session) return null

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <p className="text-gray-600">{quiz.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{quiz.timeLimit} minutes</div>
                  <div className="text-sm text-gray-600">Time limit</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold">{quiz.totalQuestions} questions</div>
                  <div className="text-sm text-gray-600">Total questions</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold">{quiz.passingScore}%</div>
                  <div className="text-sm text-gray-600">Passing score</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 mb-1">Instructions:</p>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• You have {quiz.timeLimit} minutes to complete the quiz</li>
                      <li>• You can navigate between questions using the navigation buttons</li>
                      <li>• Make sure to answer all questions before submitting</li>
                      <li>• You need {quiz.passingScore}% to pass this quiz</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button size="lg" onClick={handleStartQuiz}>
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Quiz Results Screen
  if (showResults) {
    const passed = score >= quiz.passingScore
    
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {passed ? 'Congratulations!' : 'Quiz Completed'}
              </CardTitle>
              <p className="text-gray-600">
                {passed ? 'You passed the quiz!' : 'You can retake the quiz to improve your score.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {score}%
                </div>
                <div className="text-gray-600">
                  {quiz.questions.filter((_: any, index: number) => 
                    answers[quiz.questions[index].id] === quiz.questions[index].correctAnswer
                  ).length} out of {quiz.questions.length} correct
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold">Passing Score</div>
                  <div className="text-2xl font-bold text-gray-600">{quiz.passingScore}%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold">Your Score</div>
                  <div className={`text-2xl font-bold ${
                    passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {score}%
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.push(`/student/course/${courseId}`)}
                >
                  Back to Course
                </Button>
                {!passed && (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setQuizStarted(false)
                      setQuizCompleted(false)
                      setShowResults(false)
                      setCurrentQuestion(0)
                      setAnswers({})
                      setTimeLeft(quiz.timeLimit * 60)
                    }}
                  >
                    Retake Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Quiz Questions Screen
  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">{quiz.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className={timeLeft < 300 ? 'text-red-600 font-medium' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion + 1}. {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentQ.options.map((option: string, index: number) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQ.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={index}
                    checked={answers[currentQ.id] === index}
                    onChange={() => handleAnswerSelect(currentQ.id, index)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[currentQ.id] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQ.id] === index && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
            
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex space-x-2">
                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button onClick={handleSubmitQuiz}>
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[quiz.questions[index].id] !== undefined
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}