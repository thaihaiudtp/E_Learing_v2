'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileQuestion,
  Plus,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  UserCheck,
  Settings
} from 'lucide-react'

const stats = [
  { label: 'Total Students', value: '2,847', icon: Users, color: 'blue', change: '+12%' },
  { label: 'Active Courses', value: '156', icon: BookOpen, color: 'green', change: '+8%' },
  { label: 'Teachers', value: '43', icon: GraduationCap, color: 'purple', change: '+3%' },
  { label: 'Quizzes Created', value: '289', icon: FileQuestion, color: 'orange', change: '+15%' }
]

const recentActivities = [
  { type: 'student', message: 'New student Sarah Johnson registered', time: '2 minutes ago' },
  { type: 'course', message: 'Course "Advanced React" was published', time: '1 hour ago' },
  { type: 'quiz', message: 'Quiz "JavaScript Fundamentals" was created', time: '3 hours ago' },
  { type: 'teacher', message: 'Teacher Mike Chen updated course content', time: '5 hours ago' }
]

const quickActions = [
  {
    title: 'Create New Course',
    description: 'Add a new course with lessons and quizzes',
    icon: BookOpen,
    href: '/admin/courses/create',
    color: 'blue'
  },
  {
    title: 'Manage Students',
    description: 'View and manage student accounts',
    icon: Users,
    href: '/admin/students',
    color: 'green'
  },
  {
    title: 'Manage Teachers',
    description: 'Review and approve teacher applications',
    icon: GraduationCap,
    href: '/admin/teachers',
    color: 'purple'
  },
  {
    title: 'Quiz Management',
    description: 'Create and manage course assessments',
    icon: FileQuestion,
    href: '/admin/quizzes',
    color: 'orange'
  }
]

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/student/dashboard')
    }
  }, [status, session, router])

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

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {session.user?.name}. Here&apos;s what&apos;s happening with your platform.
            </p>
          </div>
          <Button onClick={() => router.push('/admin/courses/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm flex items-center mt-1 ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'student' ? 'bg-blue-100' :
                      activity.type === 'course' ? 'bg-green-100' :
                      activity.type === 'quiz' ? 'bg-orange-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'student' && <Users className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'course' && <BookOpen className="h-4 w-4 text-green-600" />}
                      {activity.type === 'quiz' && <FileQuestion className="h-4 w-4 text-orange-600" />}
                      {activity.type === 'teacher' && <GraduationCap className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Key metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Course Completion Rate</p>
                      <p className="text-sm text-gray-600">Average across all courses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">87%</p>
                    <p className="text-xs text-green-600">+5% this month</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Active Students</p>
                      <p className="text-sm text-gray-600">Students active this week</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">1,234</p>
                    <p className="text-xs text-green-600">+8% this week</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Certificates Issued</p>
                      <p className="text-sm text-gray-600">This month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">156</p>
                    <p className="text-xs text-green-600">+23% this month</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Course Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/courses')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Manage All Courses
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/courses/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/lessons')}
              >
                <Play className="h-4 w-4 mr-2" />
                Manage Lessons
              </Button>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/students')}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Students
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/teachers')}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Manage Teachers
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/approvals')}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Pending Approvals
              </Button>
            </CardContent>
          </Card>

          {/* Assessment Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileQuestion className="h-5 w-5" />
                <span>Assessment Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/quizzes')}
              >
                <FileQuestion className="h-4 w-4 mr-2" />
                Manage Quizzes
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/quizzes/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Quiz
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/admin/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}