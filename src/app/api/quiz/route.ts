// app/api/quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Quiz } from "@/model/quiz";
import { IQuiz } from "@/types/quiz/type";
import { ResponseDTO } from "@/dto/ResponseDTO";

// Create quiz
export const POST = async (req: NextRequest) => {
  await connectDB();
  try {
    const body: IQuiz = await req.json();

    const quiz = await Quiz.create(body);

    const response: ResponseDTO = {
      status: 201,
      data: quiz,
      message: "Quiz created successfully",
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ResponseDTO = {
      status: 500,
      data: null,
      message: "Failed to create quiz",
    };
    return NextResponse.json(response, { status: 500 });
  }
};

// Get all quiz
export const GET = async () => {
  await connectDB();
  try {
    const quizzes = await Quiz.find();

    const response: ResponseDTO = {
      status: 200,
      data: quizzes,
      message: "Quizzes retrieved successfully",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ResponseDTO = {
      status: 500,
      data: null,
      message: "Failed to retrieve quizzes",
    };
    return NextResponse.json(response, { status: 500 });
  }
};
