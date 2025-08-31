export enum CourseLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED'
}
export interface CourseRequest {
  title: string
  description: string
  category: string
  price?: number
  level?: CourseLevel
  thumbnail?: string
  duration?: string
  language?: string
  teacher: string
  requirements?: string[]
  features?: string[]
}