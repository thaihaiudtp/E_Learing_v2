// src/app/api/course/route.ts
import { NextResponse, NextRequest} from "next/server"
import connectDB from "@/lib/db"
import { Teacher, ITeacher} from "@/model/teacher"
import { ResponseDTO } from "@/dto/ResponseDTO"
import { FilterQuery } from "mongoose"
import { TeacherRequest } from "@/dto/teacher/TeacherRequest"
import { checkSession } from "@/lib/check-session"
export async function GET(req: NextRequest) {
  await connectDB()
  try {
    const {searchParams} = new URL(req.url);
    const current = parseInt(searchParams.get('current') || "1", 10);
    const page_size = parseInt(searchParams.get('page_size') || "10", 10);
    const search = searchParams.get("search") || ""; // <-- thêm search
    const filter: FilterQuery<ITeacher> = search
      ? { name: { $regex: search, $options: "i" } }
      : {};
    const skip = (current - 1) * page_size;
    const [teacher, total] = await Promise.all([
      Teacher.find(filter).skip(skip).limit(page_size),
      Teacher.countDocuments(filter)
    ])
    const response: ResponseDTO = {
      status: 200,
      data: teacher,
      meta: {
        current,
        total,
        page_size
      },
      message: 'Teachers retrieved successfully'
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ResponseDTO = {
      status: 500,
      data: null,
      message: 'Failed to retrieve teachers'
    }
    return NextResponse.json(response)
  }
}

export async function POST(req: Request) {
  const session = await checkSession();
  if(!session || session?.user.role !== 'ADMIN') {
    const response: ResponseDTO = {
      status: 401,
      data: null,
      message: 'Unauthorized'
    }
    return NextResponse.json(response)
  }
  const body: TeacherRequest = await req.json()
  if(!body.full_name || !body.email) {
    const response: ResponseDTO = {
      status: 400,
      data: null,
      message: 'Missing required fields'
    }
    return NextResponse.json(response)
  }
  await connectDB();
  try {
    const teacher = await Teacher.create(body);
    const response: ResponseDTO = {
      status: 201,
      data: teacher,
      message: 'Teacher created successfully'
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ResponseDTO = {
      status: 500,
      data: null,
      message: 'Failed to create teacher'
    }
    return NextResponse.json(response)
  }
}
