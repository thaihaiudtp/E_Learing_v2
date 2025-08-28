export enum CourseLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED'
}
export interface CourseRequest {
  title: string
  description: string
  teacherId: number
  categoryId: number
  slug?: string
  price?: number
  level?: CourseLevel
  thumbnail?: string
  duration?: string
  language?: string
  requirements?: string[]
  features?: string[]
}