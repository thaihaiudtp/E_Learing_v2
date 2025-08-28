import {prisma} from '@/lib/prisma';
export class SkillService {
    static async createSkill(name: string) {
        return prisma.skill.create({
            data: {
                name: name
            }
        })
    }
}