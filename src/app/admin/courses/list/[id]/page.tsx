"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CourseDetail } from '@/types/course/detail';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Clock,
  DollarSign,
  Play,
  FileText,
  User,
  Tag,
  Calendar,
  Edit,
  Trash2,
  Star,
  CheckCircle,
  Video,
  Download,
  Plus
} from 'lucide-react';
import Link from "next/link";
import Image from 'next/image';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourseDetail() {
      if (!params.id) return;

      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/course/${params.id}`);
        const data = await res.json();

        if (data.status === 200) {
          setCourse(data.data);
        } else {
          setError(data.message || "Không tìm thấy khoá học");
        }
      } catch {
        setError("Lỗi kết nối server");
      }
      setLoading(false);
    }

    fetchCourseDetail();
  }, [params.id]);

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài học này?")) return;

    try {
      const res = await fetch(`/api/lesson/${lessonId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.status === 200) {
        // Refresh course data
        setCourse(prev => prev ? {
          ...prev,
          lessons: prev.lessons?.filter(l => l._id !== lessonId) || []
        } : null);
      } else {
        alert(data.message || "Xóa bài học thất bại");
      }
    } catch {
      alert("Lỗi kết nối server");
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800 border-green-200';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ADVANCED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin khoá học...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy khoá học</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>

            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center">
                      <BookOpen className="h-10 w-10" />
                    </div>
                    {course.thumbnail && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-blue-100 text-lg mb-4">{course.description}</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{course.students?.length || 0} học viên</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>${course.price || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link href={`/admin/courses/${course._id}/edit`}>
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      <Edit className="h-4 w-4 mr-2 text-blue-600 " />
                      <span className="text-blue-600 hover:text-white">Chỉnh sửa</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Info */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span>Thông tin khoá học</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Trình độ</label>
                        <div className="mt-1">
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getLevelColor(course.level || '')}`}>
                            {course.level}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ngôn ngữ</label>
                        <p className="mt-1 text-gray-900">{course.language}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Thời lượng</label>
                        <p className="mt-1 text-gray-900">{course.duration}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Giá</label>
                        <p className="mt-1 text-2xl font-bold text-green-600">${course.price || 0}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Số học viên</label>
                        <p className="mt-1 text-gray-900">{course.students?.length || 0} học viên</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                        <p className="mt-1 text-gray-900">
                          {course.createdAt ? new Date(course.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  {course.requirements && course.requirements.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-3 block">Yêu cầu</label>
                      <div className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {course.features && course.features.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-3 block">Tính năng</label>
                      <div className="space-y-2">
                        {course.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lessons */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Play className="h-5 w-5 text-blue-600" />
                      <span>Nội dung khoá học ({course.lessons?.length || 0} bài học)</span>
                    </CardTitle>
                    <Link href={`/admin/courses/list/${course._id}/lesson/create`}>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm bài học
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {course.lessons && course.lessons.length > 0 ? (
                    <div className="space-y-4">
                      {course.lessons.map((lesson, index) => (
                        <div key={lesson._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Video className="h-6 w-6 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-gray-500">Bài {index + 1}</span>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">{lesson.title}</h3>
                              {lesson.description && (
                                <p className="text-gray-600 mb-3">{lesson.description}</p>
                              )}
                              {lesson.resources && lesson.resources.length > 0 && (
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-500">
                                    {lesson.resources.length} tài liệu
                                  </span>
                                </div>
                              )}
                              <div className="flex space-x-2 mt-3">
                                <Link href={`/admin/courses/list/${course._id}/lesson/${lesson._id}`}>
                                  <Button size="sm" variant="outline">
                                    <FileText className="h-4 w-4 mr-1" />
                                    Chi tiết
                                  </Button>
                                </Link>
                                <Link href={`/admin/courses/list/${course._id}/lesson/${lesson._id}/edit`}>
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Sửa
                                  </Button>
                                </Link>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteLesson(lesson._id)}>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Xóa
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài học</h3>
                      <p className="text-gray-500">Khoá học này chưa có nội dung bài học nào.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Category Info */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-blue-600" />
                    <span>Danh mục</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Tag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{course.category?.title || 'N/A'}</h3>
                      <p className="text-sm text-gray-500">Danh mục khoá học</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Teacher Info */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Giáo viên</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{course.teacher?.full_name || 'N/A'}</h3>
                      <p className="text-sm text-gray-500">{course.teacher?.email || ''}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students Info */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Học viên ({course.students?.length || 0})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {course.students && course.students.length > 0 ? (
                    <div className="space-y-3">
                      {course.students.slice(0, 5).map((student) => (
                        <div key={student._id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            {student.avatar ? (
                              <Image
                                src={student.avatar}
                                alt={student.full_name}
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.full_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      ))}
                      {course.students.length > 5 && (
                        <div className="text-center pt-2">
                          <p className="text-sm text-gray-500">
                            Và {course.students.length - 5} học viên khác...
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Chưa có học viên nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Thao tác nhanh</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/admin/courses/${course._id}/edit`} className="w-full">
                    <Button className="w-full" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa khoá học
                    </Button>
                  </Link>
                  <Button className="w-full" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Quản lý học viên
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Xuất báo cáo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}