"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Save, ArrowLeft, Plus } from 'lucide-react';
import { fetchCategories } from '@/service/category';
import { CategoryResponse } from "@/types/category/type";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [teachers, setTeachers] = useState<{_id: string, full_name: string}[]>([]);
  const [categories, setCategories] = useState<CategoryResponse>();
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "BEGINNER",
    price: 0,
    duration: "",
    language: "English",
    thumbnail: "",
    requirements: [""],
    features: [""],
    teacher: "",
  });

  useEffect(() => {
    async function fetchTeachersAndCategories() {
      try {
        const res = await fetch("/api/teacher?current=1&page_size=100");
        const data = await res.json();
        if (data.status === 200 && Array.isArray(data.data)) {
          setTeachers(data.data);
        }
      } catch {}
      try {
        const catRes = await fetchCategories();
        if (catRes.status === 200 && Array.isArray(catRes.data)) {
          setCategories(catRes);
        }
      } catch {}
    }
    fetchTeachersAndCategories();
  }, []);

  const handleCourseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setCourseData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleArrayFieldChange = (
    field: 'requirements' | 'features',
    index: number,
    value: string
  ) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'requirements' | 'features') => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayField = (field: 'requirements' | 'features', index: number) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      if (!courseData.title || !courseData.description || !courseData.category) {
        setError("Vui lòng nhập đầy đủ thông tin bắt buộc");
        setIsLoading(false);
        return;
      }
      // Thêm teacher nếu có logic đăng nhập
      // courseData.teacher = session?.user?.id || "";
      const res = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });
      const data = await res.json();
      if (data.status === 201) {
        setSuccess("Tạo khoá học thành công!");
        setIsLoading(false);
        setTimeout(() => {
          router.push("/admin/courses/list");
        }, 1500);
      } else {
        setError(data.message || "Tạo khoá học thất bại");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Lỗi kết nối server");
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/admin")}> <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại Admin </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Đang tạo...</>) : (<><Save className="h-4 w-4 mr-2" /> Tạo khoá học</>)}
          </Button>
        </div>
        {error && (<div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">{error}</p></div>)}
        {success && (<div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="text-green-600">{success}</p></div>)}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khoá học</CardTitle>
            <CardDescription>Nhập thông tin cơ bản cho khoá học mới</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên khoá học *</label>
                  <input type="text" name="title" value={courseData.title} onChange={handleCourseChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập tên khoá học" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                  <select
                    name="category"
                    value={courseData.category}
                    onChange={handleCourseChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories?.data?.length === 0 && <option disabled>Không có danh mục</option>}
                    {categories?.data?.map(category => (
                      <option key={category._id} value={category._id}>{category?.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ</label>
                  <select name="level" value={courseData.level} onChange={handleCourseChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá ($)</label>
                  <input type="number" name="price" value={courseData.price} onChange={handleCourseChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng</label>
                  <input type="text" name="duration" value={courseData.duration} onChange={handleCourseChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="VD: 8 tuần" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                  <select name="language" value={courseData.language} onChange={handleCourseChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giáo viên *</label>
                  <select
                    name="teacher"
                    value={courseData.teacher}
                    onChange={handleCourseChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn giáo viên</option>
                    {teachers.length === 0 && <option disabled>Không có giáo viên</option>}
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>{teacher.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả *</label>
                <textarea name="description" value={courseData.description} onChange={handleCourseChange} rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Mô tả khoá học" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                <input type="url" name="thumbnail" value={courseData.thumbnail} onChange={handleCourseChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://example.com/image.jpg" />
              </div>
              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu</label>
                <div className="space-y-2">
                  {courseData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="text" value={req} onChange={e => handleArrayFieldChange('requirements', index, e.target.value)} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập yêu cầu" />
                      {courseData.requirements.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeArrayField('requirements', index)}><span className="text-xs">X</span></Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayField('requirements')}><Plus className="h-4 w-4 mr-2" />Thêm yêu cầu</Button>
                </div>
              </div>
              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tính năng khoá học</label>
                <div className="space-y-2">
                  {courseData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="text" value={feature} onChange={e => handleArrayFieldChange('features', index, e.target.value)} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập tính năng" />
                      {courseData.features.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeArrayField('features', index)}><span className="text-xs">X</span></Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayField('features')}><Plus className="h-4 w-4 mr-2" />Thêm tính năng</Button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full mt-4">
                {isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Đang tạo...</>) : (<><Save className="h-4 w-4 mr-2" /> Tạo khoá học</>)}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}