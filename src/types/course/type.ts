export interface Course{
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
  category: string ; // populated object
  teacher: string ; // populated object
  students: string[]; // populated objects
  lessons: string[]; // populated objects
  rating?: number;
}