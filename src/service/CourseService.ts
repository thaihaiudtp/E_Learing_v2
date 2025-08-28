import { prisma } from '@/lib/prisma'
import { CourseRequest } from '@/dto/course/CourseRequset'
export class CourseService {
  static async createCourse(data: CourseRequest) {
    return prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        teacherId: data.teacherId,  
        categoryId: data.categoryId,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
        price: data.price || 0,
        level: data.level || 'BEGINNER',
        thumbnail: data.thumbnail,
        duration: data.duration,
        language: data.language || 'English'
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        category: true
      }
    })
  }

  static async getAllCourses() {
    return prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        category: true,
        _count: {
          select: {
            enrollments: true,
            sections: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  static async getCourseById(id: number) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        category: true,
        sections: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    })
  }

  static async getCoursesByTeacher(teacherId: number) {
    return prisma.course.findMany({
      where: { teacherId },
      include: {
        category: true,
        _count: {
          select: {
            enrollments: true,
            sections: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}