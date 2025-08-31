'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  Plus, 
  X, 
  Upload,
  Play,
  FileQuestion,
  Save,
  ArrowLeft,
  Clock,
  Users,
  Award
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  videoUrl: string
  duration: string
  description: string
  resources: string[]
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Quiz {
  id: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  questions: QuizQuestion[]
}

export default function CreateCoursePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Course basic info
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'BEGINNER',
    price: '',
    duration: '',
    language: 'English',
    thumbnail: '',
    requirements: [''],
    features: ['']
  })

  // Lessons
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: '',
    title: '',
    videoUrl: '',
    duration: '',
    description: '',
    resources: ['']
  })

  // Quiz
  const [quiz, setQuiz] = useState<Quiz>({
    id: '',
    title: '',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    questions: []
  })

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    id: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  })

  const [activeTab, setActiveTab] = useState('course')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/student/dashboard')
    }
  }, [status, session, router])

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCourseData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleArrayFieldChange = (field: 'requirements' | 'features', index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayField = (field: 'requirements' | 'features') => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayField = (field: 'requirements' | 'features', index: number) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentLesson(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLessonResourceChange = (index: number, value: string) => {
    setCurrentLesson(prev => ({
      ...prev,
      resources: prev.resources.map((item, i) => i === index ? value : item)
    }))
  }

  const addLessonResource = () => {
    setCurrentLesson(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }))
  }

  const removeLessonResource = (index: number) => {
    setCurrentLesson(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
  }

  const addLesson = () => {
    if (currentLesson.title && currentLesson.videoUrl) {
      const newLesson = {
        ...currentLesson,
        id: Date.now().toString(),
        resources: currentLesson.resources.filter(r => r.trim() !== '')
      }
      setLessons(prev => [...prev, newLesson])
      setCurrentLesson({
        id: '',
        title: '',
        videoUrl: '',
        duration: '',
        description: '',
        resources: ['']
      })
    }
  }

  const removeLesson = (id: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== id))
  }

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleOptionChange = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }))
  }

  const addQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.every(opt => opt.trim() !== '')) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString()
      }
      setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }))
      setCurrentQuestion({
        id: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      })
    }
  }

  const removeQuestion = (id: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }))
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // Validate required fields
      if (!courseData.title || !courseData.description || !courseData.category) {
        setError('Please fill in all required course information')
        return
      }

      if (lessons.length === 0) {
        setError('Please add at least one lesson')
        return
      }

      // Simulate API call
      setTimeout(() => {
        setSuccess('Course created successfully!')
        setIsLoading(false)
        setTimeout(() => {
          router.push('/admin/courses')
        }, 2000)
      }, 2000)
    } catch (error) {
      setError('Failed to create course. Please try again.')
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!session || session.user.role !== 'ADMIN') return null

  const tabs = [
    { id: 'course', label: 'Course Info', icon: BookOpen },
    { id: 'lessons', label: 'Lessons', icon: Play },
    { id: 'quiz', label: 'Quiz', icon: FileQuestion }
  ]

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600 mt-2">Build a comprehensive course with lessons and assessments</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Course
              </>
            )}
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Course Creation Progress</span>
            <span>{lessons.length} lessons • {quiz.questions.length} quiz questions</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, (
                  (courseData.title ? 25 : 0) + 
                  (lessons.length > 0 ? 50 : 0) + 
                  (quiz.questions.length > 0 ? 25 : 0)
                ))}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'course' && (
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Basic details about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={courseData.title}
                    onChange={handleCourseChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={courseData.category}
                    onChange={handleCourseChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile Development">Mobile Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={courseData.level}
                    onChange={handleCourseChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={courseData.price}
                    onChange={handleCourseChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={courseData.duration}
                    onChange={handleCourseChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 8 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={courseData.language}
                    onChange={handleCourseChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleCourseChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe what students will learn in this course"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={courseData.thumbnail}
                  onChange={handleCourseChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <div className="space-y-2">
                  {courseData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter requirement"
                      />
                      {courseData.requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField('requirements', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField('requirements')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Features
                </label>
                <div className="space-y-2">
                  {courseData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleArrayFieldChange('features', index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter feature"
                      />
                      {courseData.features.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField('features', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField('features')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-6">
            {/* Add New Lesson */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Lesson</CardTitle>
                <CardDescription>Create engaging video lessons for your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={currentLesson.title}
                      onChange={handleLessonChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter lesson title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={currentLesson.duration}
                      onChange={handleLessonChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 15:30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={currentLesson.videoUrl}
                    onChange={handleLessonChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={currentLesson.description}
                    onChange={handleLessonChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe what students will learn in this lesson"
                  />
                </div>

                {/* Resources */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resources
                  </label>
                  <div className="space-y-2">
                    {currentLesson.resources.map((resource, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={resource}
                          onChange={(e) => handleLessonResourceChange(index, e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Resource name or URL"
                        />
                        {currentLesson.resources.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLessonResource(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLessonResource}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Resource
                    </Button>
                  </div>
                </div>

                <Button onClick={addLesson}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </CardContent>
            </Card>

            {/* Lessons List */}
            {lessons.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Course Lessons ({lessons.length})</CardTitle>
                  <CardDescription>Manage your course curriculum</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-600">{lesson.duration}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLesson(lesson.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {/* Quiz Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
                <CardDescription>Configure your course assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      value={quiz.title}
                      onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter quiz title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={quiz.timeLimit}
                      onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      value={quiz.passingScore}
                      onChange={(e) => setQuiz(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Description
                  </label>
                  <textarea
                    value={quiz.description}
                    onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe what this quiz covers"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Add Question */}
            <Card>
              <CardHeader>
                <CardTitle>Add Question</CardTitle>
                <CardDescription>Create multiple choice questions for your quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question *
                  </label>
                  <textarea
                    name="question"
                    value={currentQuestion.question}
                    onChange={handleQuestionChange}
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter your question"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options *
                  </label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                          className="text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Option ${index + 1}`}
                        />
                        <span className="text-sm text-gray-500 w-16">
                          {currentQuestion.correctAnswer === index ? 'Correct' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explanation
                  </label>
                  <textarea
                    name="explanation"
                    value={currentQuestion.explanation}
                    onChange={handleQuestionChange}
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Explain why this is the correct answer"
                  />
                </div>

                <Button onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            {quiz.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Questions ({quiz.questions.length})</CardTitle>
                  <CardDescription>Review and manage your quiz questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quiz.questions.map((question, index) => (
                      <div key={question.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">
                            {index + 1}. {question.question}
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1 text-sm">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex} 
                              className={`p-2 rounded ${
                                optIndex === question.correctAnswer 
                                  ? 'bg-green-50 text-green-800 font-medium' 
                                  : 'text-gray-600'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}