// src/app/api/course/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Course } from "@/model/courses"
import connectDB from "@/lib/db"
import { ResponseDTO } from "@/dto/ResponseDTO";
import { CourseRequest } from "@/dto/course/CourseRequset";
import { FilterQuery } from "mongoose";
import { ICourse } from "@/model/courses";
import { checkSession } from "@/lib/check-session";
export const GET = async (req: NextRequest) => {
  await connectDB()
  try {
    const {searchParams} = new URL(req.url);
    const current = parseInt(searchParams.get('current') || "1", 10);
    const page_size = parseInt(searchParams.get('page_size') || "10", 10);
    const search = searchParams.get("search") || ""; // <-- thêm search
    const category = searchParams.get("category") || ""; // filter theo category
    const teacher = searchParams.get("teacher") || ""; // filter theo teacher
    const skip = (current - 1) * page_size;
    const filter: FilterQuery<ICourse> = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category; // giả sử category là ObjectId (string)
    }
    if (teacher) {
      filter.teacher = teacher; // giả sử teacher là ObjectId (string)
    }

    const [courses, total] = await Promise.all([
      Course.find(filter).skip(skip).limit(page_size),
      Course.countDocuments(filter)
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
}

export const POST = async (req: Request) => {
  const session = await checkSession();
  if(!session || session?.user.role !== 'ADMIN') {
    const response: ResponseDTO = {
      status: 401,
      data: null,
      message: 'Unauthorized'
    }
    return NextResponse.json(response)
  }
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
}