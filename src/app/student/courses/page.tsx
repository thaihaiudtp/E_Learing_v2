"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Grid, List, Filter, BookOpen, Star, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import { Course } from '@/types/course/type';
import { Category } from '@/types/category/type';
import { ITeacher } from '@/model/teacher';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTeacher, setSelectedTeacher] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [categories, setCategories] = useState<Category[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const catRes = await fetch('/api/category?current=1&page_size=100');
        const catData = await catRes.json();
        if (catData.status === 200 && Array.isArray(catData.data)) {
          setCategories(catData.data as Category[]);
        }
      } catch {}
      try {
        const teacherRes = await fetch('/api/teacher?current=1&page_size=100');
        const teacherData = await teacherRes.json();
        if (teacherData.status === 200 && Array.isArray(teacherData.data)) {
          setTeachers(teacherData.data as ITeacher[]);
        }
      } catch {}
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      const params = new URLSearchParams({
        current: current.toString(),
        page_size: pageSize.toString(),
      });
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedTeacher !== 'All') params.append('teacher', selectedTeacher);
      const res = await fetch(`/api/course?${params.toString()}`);
      const data = await res.json();
      if (data.status === 200) {
        setCourses(data.data as Course[]);
        setTotal(data.meta?.total || 0);
      }
      setLoading(false);
    }
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedTeacher, current, pageSize]);

  useEffect(() => {
    const filtered = [...courses];
    // Sort courses
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.students?.length ?? 0) - (a.students?.length ?? 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'newest':
        break;
    }
    setFilteredCourses(filtered);
  }, [courses, sortBy]);

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
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrent(1); }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={e => { setSelectedCategory(e.target.value); setCurrent(1); }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="All">Tất cả danh mục</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>{category.title}</option>
                    ))}
                  </select>
                  {/* Teacher Filter */}
                  <select
                    value={selectedTeacher}
                    onChange={e => { setSelectedTeacher(e.target.value); setCurrent(1); }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="All">Tất cả giáo viên</option>
                    {teachers.map(teacher => (
                      <option key={teacher._id as string} value={teacher._id as string}>{teacher.full_name}</option>
                    ))}
                  </select>
                  {/* Sort Filter */}
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="popular">Phổ biến</option>
                    <option value="rating">Đánh giá cao</option>
                    <option value="price-low">Giá thấp nhất</option>
                    <option value="price-high">Giá cao nhất</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                </div>
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Results Count & Pagination */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {total} courses
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={current === 1}
              onClick={() => setCurrent(current - 1)}
            >
              &lt;
            </Button>
            <span className="px-2">Trang {current} / {Math.max(1, Math.ceil(total / pageSize))}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={current >= Math.ceil(total / pageSize)}
              onClick={() => setCurrent(current + 1)}
            >
              &gt;
            </Button>
          </div>
        </div>
        {/* Courses Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course._id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-xl">
                  <Image 
                    src={course.thumbnail || '/default-course.jpg'} 
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
                      ${course.price ?? 0}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    {/* <span>By {typeof course.teacher === 'object' ? course?.teacher?.full_name : course.teacher}</span> */}
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {/* {course.rating ?? 0} */}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students?.length ?? 0}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    variant="default"
                    onClick={() => router.push(`/student/course/${course._id}`)}
                  >
                    Xem khoá học
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <Card key={course._id} className="hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="w-64 h-40 overflow-hidden rounded-l-xl flex-shrink-0">
                    <Image
                      src={course.thumbnail || '/default-course.jpg'} 
                      alt={course.title}
                      width={256}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                        <p className="text-gray-600">{course.description}</p>
                        <div className="mt-2 text-sm text-gray-500">{course.level} • {course.duration} • {course.language}</div>
                      </div>
                      <div className="text-right">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">${course.price ?? 0}</span>
                        {/* <div className="mt-2 text-sm text-gray-500">By {typeof course.teacher === 'object' ? course.teacher.full_name : course.teacher}</div> */}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students?.length ?? 0} học viên</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      variant="default"
                      onClick={() => router.push(`/student/course/${course._id}`)}
                    >
                      Xem khoá học
                    </Button>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy khoá học</h3>
              <p className="text-gray-600 mb-6">
                Hãy thử thay đổi bộ lọc hoặc tìm kiếm khác
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedTeacher('All');
                }}
              >
                Xoá bộ lọc
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}