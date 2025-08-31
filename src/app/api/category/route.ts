// src/app/api/course/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Category } from "@/model/category";
import connectDB from "@/lib/db"
import { ResponseDTO } from "@/dto/ResponseDTO";
import { withAuth, withAuthAdmin } from "@/lib/with-auth";
import { CategoryRequest } from "@/dto/category/CategoryRequest";
import { Course } from "@/model/courses";
export const GET = async (req: NextRequest) => {
  await connectDB()
  try {
    const {searchParams} = new URL(req.url);
    const current = parseInt(searchParams.get('current') || "1", 10);
    const page_size = parseInt(searchParams.get('page_size') || "10", 10);
    const skip = (current - 1) * page_size;
    const [category, total] = await Promise.all([
      Category.find().skip(skip).limit(page_size),
      Category.countDocuments()
    ])
    const response: ResponseDTO = {
      status: 200,
      data: category,
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
};

export const POST = async (req: Request) => {
  const body: CategoryRequest = await req.json();
  if(!body.title) {
    const response: ResponseDTO = {
      status: 400,
      data: null,
      message: 'Missing required fields'
    }
    return NextResponse.json(response)
  }
  await connectDB();
  try {
    const category = await Category.create(body);
    const response: ResponseDTO = {
      status: 201,
      data: category,
      message: 'Category created successfully'
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