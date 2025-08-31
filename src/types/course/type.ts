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
  category: string | any; // populated object
  teacher: string | any; // populated object
  students: string[] | any[]; // populated objects
  lessons: string[] | any[]; // populated objects
  rating?: number;
}