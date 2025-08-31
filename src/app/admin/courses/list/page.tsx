"use client";
import { useState, useEffect } from "react";
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Course } from '@/types/course/type';
import { Search, ChevronLeft, ChevronRight, Plus, BookOpen, Users, DollarSign, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import Link from "next/link";

export default function AdminCourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          current: current.toString(),
          page_size: pageSize.toString(),
        });
        if (search) params.append("search", search);
        const res = await fetch(`/api/course?${params.toString()}`);
        const data = await res.json();
        if (data.status === 200) {
          setCourses(data.data);
          setTotal(data.meta?.total || 0);
        } else {
          setError(data.message || "Lỗi lấy danh sách khoá học");
        }
      } catch {
        setError("Lỗi kết nối server");
      }
      setLoading(false);
    }
    fetchCourses();
  }, [search, current, pageSize]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrent(1);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Quản lý khoá học</h1>
                  <p className="text-blue-100 mt-2">Quản lý và theo dõi tất cả khoá học trên hệ thống</p>
                </div>
              </div>
              <Link href="/admin/courses/create">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                  <Plus className="h-4 w-4 mr-2 text-blue-600 hover:text-white" />
                  <span className="text-blue-600 hover:text-white">Tạo khoá học mới</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng khoá học</p>
                    <p className="text-2xl font-bold text-gray-900">{total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Học viên</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {courses.reduce((acc, course) => acc + (course.students?.length ?? 0), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${courses.reduce((acc, course) => acc + ((course.price ?? 0) * (course.students?.length ?? 0)), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Trung bình</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${courses.length > 0 ? Math.round(courses.reduce((acc, course) => acc + (course.price ?? 0), 0) / courses.length) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">Danh sách khoá học</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Quản lý tất cả khoá học hiện có trên hệ thống
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-500">
                  Hiển thị {courses.length} / {total} khoá học
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm kiếm theo tên khoá học..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </form>

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Đang tải danh sách khoá học...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <div className="text-red-600 mb-2">
                    <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Table */}
              {!loading && !error && (
                <div className="overflow-hidden border border-gray-200 rounded-xl">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Khoá học
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thông tin
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Học viên
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {courses.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có khoá học nào</h3>
                                <p className="text-gray-500 mb-4">Hãy tạo khoá học đầu tiên của bạn</p>
                                <Link href="/admin/courses/create">
                                  <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tạo khoá học mới
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          courses.map(course => (
                            <tr key={course.title} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-12 w-12">
                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                      <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                      {course.title}
                                    </div>
                                    <div className="text-sm text-gray-500 line-clamp-2">
                                      {course.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level || '')}`}>
                                      {course.level}
                                    </span>
                                    <span className="text-sm text-gray-500">{course.language}</span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">${course.price ?? 0}</span>
                                    <span className="mx-2">•</span>
                                    <span>{course.duration}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm font-medium text-gray-900">
                                    {course.students?.length ?? 0}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <Link href={`/admin/courses/list/${course._id}`}>
                                    <Button variant="outline" size="sm" className="flex items-center">
                                      <Eye className="h-4 w-4 mr-1" />
                                      Chi tiết
                                    </Button>
                                  </Link>
                                  <Link href={`/admin/courses/${course.title}/edit`}>
                                    <Button variant="outline" size="sm" className="flex items-center">
                                      <Edit className="h-4 w-4 mr-1" />
                                      Sửa
                                    </Button>
                                  </Link>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && courses.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Hiển thị {(current - 1) * pageSize + 1} đến {Math.min(current * pageSize, total)} của {total} kết quả
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={current === 1}
                      onClick={() => setCurrent(current - 1)}
                      className="flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Trước
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, Math.ceil(total / pageSize)) }, (_, i) => {
                        const pageNumber = Math.max(1, Math.min(Math.ceil(total / pageSize) - 4, current - 2)) + i;
                        return (
                          <Button
                            key={pageNumber}
                            variant={current === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrent(pageNumber)}
                            className="w-10 h-10"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={current >= Math.ceil(total / pageSize)}
                      onClick={() => setCurrent(current + 1)}
                      className="flex items-center"
                    >
                      Sau
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
