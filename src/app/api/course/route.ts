// src/app/api/course/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Course } from "@/model/courses"
import connectDB from "@/lib/db"
import { ResponseDTO } from "@/dto/ResponseDTO";
import { CourseRequest } from "@/dto/course/CourseRequset";
import { withAuth, withAuthAdmin } from "@/lib/with-auth";
export const GET = withAuth(async (req: NextRequest) => {
  await connectDB()
  try {
    const {searchParams} = new URL(req.url);
    const current = parseInt(searchParams.get('current') || "1", 10);
    const page_size = parseInt(searchParams.get('page_size') || "10", 10);
    const skip = (current - 1) * page_size;
    const [courses, total] = await Promise.all([
      Course.find().skip(skip).limit(page_size),
      Course.countDocuments()
    ])
    const response: ResponseDTO = {
      status: 200,
      data: courses,
      meta: {
        current,
        total,
        page_size
      },
      message: 'Courses retrieved successfully'
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ResponseDTO = {
      status: 500,
      data: null,
      message: 'Failed to retrieve courses'
    }
    return NextResponse.json(response)
  }
});

export const POST = withAuthAdmin(async (req: Request) => {
  const body: CourseRequest = await req.json();
  if(!body.title || !body.description || !body.category || !body.teacher) {
    const response: ResponseDTO = {
      status: 400,
      data: null,
      message: 'Missing required fields'
    }
    return NextResponse.json(response)
  }
  await connectDB();
  try {
    const course = await Course.create(body);
    const response: ResponseDTO = {
      status: 201,
      data: course,
      message: 'Course created successfully'
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ResponseDTO = {
      status: 500,
      data: null,
      message: 'Failed to create course'
    }
    return NextResponse.json(response)
  }
})