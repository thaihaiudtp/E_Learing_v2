'use client'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Filter,
  Search,
  Grid,
  List,
  Award,
  Play
} from 'lucide-react'

const allCourses = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React and build modern web applications',
    instructor: 'John Smith',
    duration: '8 weeks',
    students: 1234,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 99,
    level: 'Beginner',
    category: 'Web Development',
    enrolled: false,
    totalLessons: 24
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts and modern ES6+ features',
    instructor: 'Sarah Johnson',
    duration: '10 weeks',
    students: 856,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 129,
    level: 'Advanced',
    category: 'Programming',
    enrolled: true,
    totalLessons: 32
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    description: 'Create beautiful and user-friendly interfaces with modern design principles',
    instructor: 'Mike Chen',
    duration: '6 weeks',
    students: 2341,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 89,
    level: 'Intermediate',
    category: 'Design',
    enrolled: false,
    totalLessons: 18
  },
  {
    id: 4,
    title: 'Python for Data Science',
    description: 'Learn Python programming and data analysis for data science applications',
    instructor: 'Emily Davis',
    duration: '12 weeks',
    students: 1876,
    rating: 4.8,
    reviews: 267,
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 149,
    level: 'Intermediate',
    category: 'Data Science',
    enrolled: false,
    totalLessons: 40
  },
  {
    id: 5,
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js and Express',
    instructor: 'David Wilson',
    duration: '9 weeks',
    students: 743,
    rating: 4.6,
    reviews: 124,
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 119,
    level: 'Intermediate',
    category: 'Backend',
    enrolled: false,
    totalLessons: 28
  },
  {
    id: 6,
    title: 'Mobile App Development with React Native',
    description: 'Create cross-platform mobile applications using React Native',
    instructor: 'Lisa Anderson',
    duration: '11 weeks',
    students: 567,
    rating: 4.5,
    reviews: 89,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 139,
    level: 'Advanced',
    category: 'Mobile Development',
    enrolled: false,
    totalLessons: 35
  }
]

const categories = ['All', 'Web Development', 'Programming', 'Design', 'Data Science', 'Backend', 'Mobile Development']
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function CoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [courses, setCourses] = useState(allCourses)
  const [filteredCourses, setFilteredCourses] = useState(allCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    let filtered = courses

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Filter by level
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    // Sort courses
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.students - a.students)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        // Keep original order for newest
        break
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedCategory, selectedLevel, sortBy, courses])

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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Courses</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover thousands of courses from expert instructors and advance your skills
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  {/* Level Filter */}
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>

                  {/* Sort Filter */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Courses Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-xl">
                  <Image 
                    src={course.image} 
                    alt={course.title}
                    width={300}
                    height={200}
                    className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-48"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-gray-900 px-2 py-1 rounded-full text-sm font-bold">
                      ${course.price}
                    </span>
                  </div>
                  {course.enrolled && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        Enrolled
                      </span>
                    </div>
                  )}
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
                      <span>({course.reviews})</span>
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
                    variant={course.enrolled ? "outline" : "default"}
                    onClick={() => router.push(`/student/course/${course.id}`)}
                  >
                    {course.enrolled ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      'View Course'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="w-64 h-40 overflow-hidden rounded-l-xl flex-shrink-0">
                    <Image
                      src={course.image} 
                      alt={course.title}
                      width={256}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {course.level}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {course.category}
                          </span>
                          {course.enrolled && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Enrolled
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-gray-600 mb-4">{course.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span>By {course.instructor}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                            <span>({course.reviews})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{course.students}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-gray-900 mb-2">${course.price}</div>
                        <Button 
                          variant={course.enrolled ? "outline" : "default"}
                          onClick={() => router.push(`/student/course/${course.id}`)}
                        >
                          {course.enrolled ? (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Continue
                            </>
                          ) : (
                            'View Course'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse different categories
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedLevel('All')
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}