export interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  slug?: string;
  price?: number;
  level?: string;
  thumbnail?: string;
  duration?: string;
  language?: string;
  requirements?: string[];
  features?: string[];
  category: {
    _id: string;
    title: string;
  };
  teacher: {
    _id: string;
    full_name: string;
    email?: string;
    avatar?: string;
  };
  students: StudentDetail[];
  lessons: LessonDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentDetail {
  _id: string;
  full_name: string;
  email: string;
  avatar?: string;
  age?: number;
  role: string;
}

export interface LessonDetail {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: string;
  resources?: string[];
  createdAt?: string;
}