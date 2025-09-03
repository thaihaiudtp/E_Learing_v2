"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Play, FileText, Clock, Plus } from "lucide-react";

interface Lesson {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  fileUrl: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
}

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getYouTubeEmbedUrl = (url: string) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = lesson ? getYouTubeEmbedUrl(lesson.videoUrl) : null;

  useEffect(() => {
    async function fetchLessonDetail() {
      if (!params.lessonId) return;

      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/lesson/${params.lessonId}`);
        const data = await res.json();

        if (data.status === 200) {
          setLesson(data.data);
        } else {
          setError(data.message || "Không tìm thấy bài học");
        }
      } catch {
        setError("Lỗi kết nối server");
      }
      setLoading(false);
    }

    fetchLessonDetail();
  }, [params.lessonId]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin bài học...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !lesson) {
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài học</h3>
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
              Quay lại khóa học
            </Button>

            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center">
                      <Play className="h-10 w-10" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                    {lesson.description && (
                      <p className="text-blue-100 text-lg mb-4">{lesson.description}</p>
                    )}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Có tài liệu</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-blue-600">Tạo câu hỏi</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Section */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="h-5 w-5 text-blue-600" />
                    <span>Video bài giảng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={lesson.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Video sẽ được hiển thị ở đây</p>
                          <p className="text-sm text-gray-400 mt-2">{lesson.videoUrl}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Lesson Info */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Thông tin bài học</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Thời lượng</label>
                      <p className="mt-1 text-gray-900">{lesson.duration}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày cập nhật</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(lesson.updatedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {lesson.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Mô tả</label>
                      <p className="text-gray-700">{lesson.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Resources */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Tài liệu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Tài liệu bài học</p>
                        <p className="text-xs text-gray-500">PDF/DOCX/PPTX</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Tải xuống
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">{lesson.fileUrl}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-blue-600" />
                    <span>Thao tác nhanh</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo câu hỏi
                  </Button>
                  <Button className="w-full" variant="outline">
                    Chỉnh sửa bài học
                  </Button>
                  <Button className="w-full" variant="outline">
                    Xem thống kê
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