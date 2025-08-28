import {prisma} from "@/lib/prisma"
import { TeacherRequest } from "@/dto/user/TeacherRequest"
export class TeacherService {
    static async createTeacher(data: TeacherRequest & {skill?: string[]}) {
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: {id: data.userId},
                data: {role: 'TEACHER'}
            })
            const teacherProfile = await tx.teacherProfile.create({
                data: {
                    userId: user.id,
                    bio: data.bio,
                    experience: data.experience,
                    verified: true,
                }
            })
            if (data.skill && data.skill.length > 0) {
                for(const skillName of data.skill) {
                    const skill = await tx.skill.upsert({
                        where: {name: skillName},
                        update: {},
                        create: {name: skillName}
                    })
                    await tx.teacherSkill.create({
                        data: {
                            teacherId: teacherProfile.id,
                            skillId: skill.id
                        }
                    })
                }
            }
        })
    }
}