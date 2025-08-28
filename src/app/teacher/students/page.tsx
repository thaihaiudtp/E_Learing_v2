'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Mail,
  MoreVertical,
  TrendingUp,
  BookOpen,
  Clock,
  Award
} from 'lucide-react'

const mockStudents = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    enrolledCourses: 3,
    completedCourses: 1,
    totalProgress: 75,
    lastActive: '2024-01-15',
    joinedDate: '2023-12-01',
    courses: [
      { name: 'Introduction to React', progress: 90 },
      { name: 'Advanced JavaScript', progress: 60 },
      { name: 'UI/UX Design', progress: 45 }
    ]
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    enrolledCourses: 2,
    completedCourses: 2,
    totalProgress: 100,
    lastActive: '2024-01-14',
    joinedDate: '2023-11-15',
    courses: [
      { name: 'Introduction to React', progress: 100 },
      { name: 'Advanced JavaScript', progress: 100 }
    ]
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    enrolledCourses: 1,
    completedCourses: 0,
    totalProgress: 25,
    lastActive: '2024-01-10',
    joinedDate: '2024-01-05',
    courses: [
      { name: 'Introduction to React', progress: 25 }
    ]
  }
]

export default function TeacherStudents() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStudents = students.length
  const activeStudents = students.filter(s => 
    new Date(s.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length
  const avgProgress = Math.round(
    students.reduce((sum, student) => sum + student.totalProgress, 0) / students.length
  )

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-2">Track and manage your students' progress</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.reduce((sum, s) => sum + s.completedCourses, 0)}
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Manage and track your students' learning progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Joined {new Date(student.joinedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Last active {new Date(student.lastActive).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {student.enrolledCourses}
                      </div>
                      <div className="text-xs text-gray-500">Enrolled</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {student.completedCourses}
                      </div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    
                    <div className="text-center min-w-[80px]">
                      <div className="text-sm font-medium text-gray-900">
                        {student.totalProgress}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.totalProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms' : 'Students will appear here once they enroll in your courses'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle>{selectedStudent.name}</CardTitle>
                      <CardDescription>{selectedStudent.email}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStudent(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedStudent.enrolledCourses}
                    </div>
                    <div className="text-sm text-gray-600">Enrolled Courses</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedStudent.completedCourses}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Course Progress</h3>
                  <div className="space-y-3">
                    {selectedStudent.courses.map((course: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{course.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}