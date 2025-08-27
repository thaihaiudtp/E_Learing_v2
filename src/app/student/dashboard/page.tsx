'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BookOpen, Clock, Users, Star, Play, Award } from 'lucide-react'

const featuredCourses = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React and build modern web applications',
    instructor: 'John Smith',
    duration: '8 weeks',
    students: 1234,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$99',
    level: 'Beginner'
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts and modern ES6+ features',
    instructor: 'Sarah Johnson',
    duration: '10 weeks',
    students: 856,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$129',
    level: 'Advanced'
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    description: 'Create beautiful and user-friendly interfaces with modern design principles',
    instructor: 'Mike Chen',
    duration: '6 weeks',
    students: 2341,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$89',
    level: 'Intermediate'
  },
  {
    id: 4,
    title: 'Python for Data Science',
    description: 'Learn Python programming and data analysis for data science applications',
    instructor: 'Emily Davis',
    duration: '12 weeks',
    students: 1876,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$149',
    level: 'Intermediate'
  }
]

const stats = [
  { label: 'Available Courses', value: '150+', icon: BookOpen },
  { label: 'Expert Instructors', value: '50+', icon: Users },
  { label: 'Students Enrolled', value: '10K+', icon: Award },
  { label: 'Hours of Content', value: '500+', icon: Clock }
]

export default function StudentDashboard() {
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

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">
              Welcome back, {session.user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Continue your learning journey and discover new courses to expand your skills.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => router.push('/student/my-courses')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Continue Learning
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Courses */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
            <Button variant="outline">View All Courses</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-gray-900 px-2 py-1 rounded-full text-sm font-bold">
                      {course.price}
                    </span>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>By {course.instructor}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => router.push(`/student/course/${course.id}`)}
                  >
                    View Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}