import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Quiz } from "@/model/quiz";
import { ResponseDTO } from "@/dto/ResponseDTO";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await connectDB();
  try {
    const id = (await params).id;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      const response: ResponseDTO = {
        status: 404,
        data: null,
        message: "Quiz not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ResponseDTO = {
      status: 200,
      data: quiz,
      message: "Quiz retrieved successfully",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ResponseDTO = {
      status: 500,
      data: null,
      message: "Failed to retrieve quiz",
    };
    return NextResponse.json(response, { status: 500 });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await connectDB();
  try {
    const id = (await params).id;
    const body = await req.json();

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedQuiz) {
      const response: ResponseDTO = {
        status: 404,
        data: null,
        message: "Quiz not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ResponseDTO = {
      status: 200,
      data: updatedQuiz,
      message: "Quiz updated successfully",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ResponseDTO = {
      status: 500,
      data: null,
      message: "Failed to update quiz",
    };
    return NextResponse.json(response, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) => {
  await connectDB();
  try {
    const id = (await params).id;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      const response: ResponseDTO = {
        status: 404,
        data: null,
        message: "Quiz not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ResponseDTO = {
      status: 200,
      data: deletedQuiz,
      message: "Quiz deleted successfully",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ResponseDTO = {
      status: 500,
      data: null,
      message: "Failed to delete quiz",
    };
    return NextResponse.json(response, { status: 500 });
  }
};
