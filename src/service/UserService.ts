import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

const saltRounds = 10

export class UserService {
  static async createUser(data: { name: string; email: string; password: string }) {
    // Hash password before creating user
    const hashedPassword = await bcrypt.hash(data.password, saltRounds)
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from response
      },
    })
  }

  static async findAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from response
      },
    })
  }

  static async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from response
      },
    })
  }

  static async findUserByEmail(email: string, includePassword = false) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: includePassword,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  static async updateUser(id: number, data: Partial<{ name: string; email: string; password: string }>) {
    const updateData: any = { ...data }
    
    // Hash password if it's being updated
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, saltRounds)
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from response
      },
    })
  }

  static async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id },
    })
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}