'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { 
  Play, 
  CheckCircle,
  BookOpen,
  FileText,
  Download,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

const courseContent = {
  1: {
    title: 'Introduction to React',
    currentLesson: {
      id: 1,
      title: 'Introduction to React',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '15:30',
      description: 'Learn what React is and why it\'s become the most popular frontend library.',
      resources: [
        { name: 'Lesson Notes.pdf', size: '2.3 MB' },
        { name: 'Code Examples.zip', size: '1.1 MB' },
        { name: 'Additional Reading.pdf', size: '890 KB' }
      ]
    },
    lessons: [
      { id: 1, title: 'Introduction to React', duration: '15:30', completed: false, current: true },
      { id: 2, title: 'Setting up Development Environment', duration: '20:15', completed: false },
      { id: 3, title: 'Your First React Component', duration: '25:45', completed: false },
      { id: 4, title: 'JSX and Components', duration: '30:20', completed: false },
      { id: 5, title: 'Props and State', duration: '35:10', completed: false }
    ]
  }
}

export default function LearnPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<typeof courseContent[1] | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const courseInfo = courseContent[Number(courseId) as keyof typeof courseContent]
    setCourse(courseInfo)
  }, [courseId])

  const handleLessonComplete = () => {
    if (course) {
      const updatedLessons = course.lessons.map((lesson) => 
        lesson.current ? { ...lesson, completed: true, current: false } : lesson
      )
      
      const currentIndex = course.lessons.findIndex((lesson) => lesson.current)
      if (currentIndex < course.lessons.length - 1) {
        updatedLessons[currentIndex + 1].current = true
      }
      
      setCourse({ ...course, lessons: updatedLessons })
    }
  }

  const handleLessonSelect = (lessonId: number) => {
    if (course) {
      const updatedLessons = course.lessons.map((lesson) => ({
        ...lesson,
        current: lesson.id === lessonId
      }))
      setCourse({ ...course, lessons: updatedLessons })
    }
  }

  if (status === 'loading' || !course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r overflow-hidden`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{course.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            {course.lessons.filter((l) => l.completed).length} of {course.lessons.length} lessons completed
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(course.lessons.filter((l) => l.completed).length / course.lessons.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {course.lessons.map((lesson, index: number) => (
              <div
                key={lesson.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  lesson.current 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleLessonSelect(lesson.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : lesson.current ? (
                      <Play className="h-5 w-5 text-blue-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      lesson.current ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {index + 1}. {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500">{lesson.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/student/course/${courseId}`)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Course
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              Q&A
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Notes
            </Button>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black relative">
          <div className="aspect-video w-full max-w-5xl mx-auto">
            <video
              className="w-full h-full"
              controls
              poster="https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800"
            >
              <source src={course.currentLesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black bg-opacity-75 rounded-lg p-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-semibold">{course.currentLesson.title}</h3>
                  <p className="text-sm text-gray-300">{course.currentLesson.duration}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                    onClick={handleLessonComplete}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="bg-white border-t">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: BookOpen },
                  { id: 'resources', label: 'Resources', icon: Download },
                  { id: 'discussion', label: 'Discussion', icon: MessageCircle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About this lesson</h3>
                  <p className="text-gray-600">{course.currentLesson.description}</p>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Downloadable Resources</h3>
                  <div className="space-y-3">
                    {course.currentLesson.resources.map((resource, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-gray-500">{resource.size}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Discussion</h3>
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No discussions yet. Be the first to ask a question!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}