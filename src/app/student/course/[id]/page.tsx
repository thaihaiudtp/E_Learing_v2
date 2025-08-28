'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Play, 
  CheckCircle,
  Award,
  Globe,
  Download,
  Share2,
} from 'lucide-react'

// Mock course data - in real app, this would come from API
const courseData = {
  1: {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React and build modern web applications with this comprehensive course. Master components, state management, hooks, and more.',
    instructor: {
      name: 'John Smith',
      bio: 'Senior Frontend Developer with 8+ years of experience',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    duration: '8 weeks',
    students: 1234,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: '$99',
    level: 'Beginner',
    language: 'English',
    lastUpdated: 'December 2024',
    certificate: true,
    downloadable: true,
    enrolled: false,
    curriculum: [
      {
        title: 'Getting Started',
        lessons: [
          { title: 'Introduction to React', duration: '15 min', completed: false },
          { title: 'Setting up Development Environment', duration: '20 min', completed: false },
          { title: 'Your First React Component', duration: '25 min', completed: false }
        ]
      },
      {
        title: 'React Fundamentals',
        lessons: [
          { title: 'JSX and Components', duration: '30 min', completed: false },
          { title: 'Props and State', duration: '35 min', completed: false },
          { title: 'Event Handling', duration: '25 min', completed: false }
        ]
      },
      {
        title: 'Advanced Concepts',
        lessons: [
          { title: 'React Hooks', duration: '40 min', completed: false },
          { title: 'Context API', duration: '35 min', completed: false },
          { title: 'Performance Optimization', duration: '45 min', completed: false }
        ]
      }
    ],
    features: [
      'Lifetime access to course materials',
      'Certificate of completion',
      'Downloadable resources',
      'Mobile and desktop access',
      'Community support',
      'Regular updates'
    ]
  }
}

export default function CourseDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<any>(null)
  const [isEnrolling, setIsEnrolling] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    // In real app, fetch course data from API
    const courseInfo = courseData[Number(courseId) as keyof typeof courseData]
    setCourse(courseInfo)
  }, [courseId])

  const handleEnroll = async () => {
    setIsEnrolling(true)
    // Simulate API call
    setTimeout(() => {
      setCourse({ ...course, enrolled: true })
      setIsEnrolling(false)
      router.push(`/student/course/${courseId}/learn`)
    }, 1500)
  }
  const handleDoQuiz = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(`/student/course/${courseId}/quiz`);
  }
  if (status === 'loading' || !course) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!session) return null

  const totalLessons = course.curriculum.reduce((acc: number, section: any) => acc + section.lessons.length, 0)
  const totalDuration = course.curriculum.reduce((acc: number, section: any) => 
    acc + section.lessons.reduce((sectionAcc: number, lesson: any) => 
      sectionAcc + parseInt(lesson.duration), 0), 0)

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Course Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{course.language}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                  <span>({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img 
                    src={course.instructor.avatar} 
                    alt={course.instructor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{course.instructor.name}</h3>
                    <p className="text-gray-600">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle>What you'll get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-xl">
                  <Play className="h-16 w-16 text-white" />
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{course.price}</div>
                  <div className="text-sm text-gray-600">One-time payment</div>
                </div>
                
                {course.enrolled ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => router.push(`/student/course/${courseId}/learn`)}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Continue Learning
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enrolling...
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </Button>
                )}
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
                <div className='space-y-3 pt-4 border-t w-full'>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleDoQuiz}>
                    Quiz
                  </Button>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lessons:</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Certificate:</span>
                    <span className="font-medium flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Curriculum */}
        <Card>
          <CardHeader>
            <CardTitle>Course Curriculum</CardTitle>
            <CardDescription>
              {course.curriculum.length} sections • {totalLessons} lessons • {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.curriculum.map((section: any, sectionIndex: number) => (
                <div key={sectionIndex} className="border rounded-lg">
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <p className="text-sm text-gray-600">
                      {section.lessons.length} lessons
                    </p>
                  </div>
                  <div className="divide-y">
                    {section.lessons.map((lesson: any, lessonIndex: number) => (
                      <div key={lessonIndex} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <Play className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{lesson.duration}</span>
                          {lesson.completed && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}