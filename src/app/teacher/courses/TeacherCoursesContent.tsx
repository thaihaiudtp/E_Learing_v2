'use client'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, Plus, Users, Eye, Edit, Trash2, MoreVertical, 
  TrendingUp, DollarSign, Clock 
} from 'lucide-react'
import Image from 'next/image'
interface Course {
  id: number
  title: string
  description: string
  thumbnail: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  students: number
  revenue: number
  rating: number
  lastUpdated: string
  sections: number
  lessons: number
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React and build modern web applications',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'PUBLISHED',
    students: 1234,
    revenue: 12340,
    rating: 4.8,
    lastUpdated: '2024-01-15',
    sections: 8,
    lessons: 24,
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts and modern ES6+ features',
    thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'DRAFT',
    students: 0,
    revenue: 0,
    rating: 0,
    lastUpdated: '2024-01-10',
    sections: 5,
    lessons: 15,
  },
]

export default function TeacherCoursesContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [courses, setCourses] = useState<Course[]>(mockCourses)

  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const urlMessage = searchParams.get('message')
    if (urlMessage) {
      setMessage(urlMessage)
      setTimeout(() => setMessage(''), 5000)
    }
  }, [searchParams])

  const handleCreateCourse = () => router.push('/teacher/courses/create')
  const handleEditCourse = (id: number) => router.push(`/teacher/courses/${id}/edit`)
  const handleViewCourse = (id: number) => router.push(`/student/course/${id}`)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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

  if (!session) return null

  const totalStudents = courses.reduce((s, c) => s + c.students, 0)
  const totalRevenue = courses.reduce((s, c) => s + c.revenue, 0)
  const publishedCourses = courses.filter(c => c.status === 'PUBLISHED').length

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">Manage and track your course performance</p>
          </div>
          <Button onClick={handleCreateCourse} size="lg">
            <Plus className="h-5 w-5 mr-2" /> Create Course
          </Button>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600">{message}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedCourses}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Course Management</h2>

          {courses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-6">Create your first course to start teaching</p>
                <Button onClick={handleCreateCourse}>
                  <Plus className="h-4 w-4 mr-2" /> Create Your First Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={32}
                      height={32}
                      className=" object-cover rounded-l-xl"
                    />
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                              {course.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                              {course.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {course.description}
                          </p>
                        </div>
                        <div className="relative ml-2">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" /> <span>{course.students} students</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" /> <span>{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" /> <span>${course.revenue}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" /> <span>{new Date(course.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewCourse(course.id)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditCourse(course.id)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
