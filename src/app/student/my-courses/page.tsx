'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BookOpen, Clock, CheckCircle, Play, BarChart3 } from 'lucide-react'

const enrolledCourses = [
  {
    id: 1,
    title: 'Introduction to React',
    instructor: 'John Smith',
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    lastAccessed: '2 days ago',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    nextLesson: 'State Management with Redux'
  },
  {
    id: 2,
    title: 'UI/UX Design Principles',
    instructor: 'Mike Chen',
    progress: 45,
    totalLessons: 18,
    completedLessons: 8,
    lastAccessed: '1 week ago',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    nextLesson: 'Color Theory and Psychology'
  },
  {
    id: 3,
    title: 'Python for Data Science',
    instructor: 'Emily Davis',
    progress: 100,
    totalLessons: 32,
    completedLessons: 32,
    lastAccessed: '3 days ago',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    nextLesson: 'Course Completed!',
    completed: true
  }
]

export default function MyCourses() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!session) return null

  const inProgressCourses = enrolledCourses.filter(course => !course.completed)
  const completedCourses = enrolledCourses.filter(course => course.completed)

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">Track your learning progress and continue where you left off</p>
          </div>
          <Button onClick={() => router.push('/student/dashboard')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Courses
          </Button>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{enrolledCourses.length}</div>
              <div className="text-sm text-gray-600">Enrolled Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{inProgressCourses.length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{completedCourses.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* In Progress Courses */}
        {inProgressCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {inProgressCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-32 h-32 object-cover rounded-l-xl"
                    />
                    <div className="flex-1 p-6">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>By {course.instructor}</CardDescription>
                      </CardHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                          <span>Last accessed {course.lastAccessed}</span>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-sm text-gray-600 mb-3">Next: {course.nextLesson}</p>
                          <Button 
                            className="w-full"
                            onClick={() => router.push(`/student/course/${course.id}/learn`)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Courses */}
        {completedCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="h-8 w-8 text-green-600 bg-white rounded-full p-1" />
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>By {course.instructor}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Completed</span>
                      </div>
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push(`/student/course/${course.id}`)}
                    >
                      Review Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {enrolledCourses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
              <Button onClick={() => router.push('/student/dashboard')}>
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}