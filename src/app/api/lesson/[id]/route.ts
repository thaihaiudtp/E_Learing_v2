import { Lesson } from "@/model/lesson";
import { Course } from "@/model/courses";
import { LessonRequest } from "@/types/lesson/type";
import { ResponseDTO } from "@/dto/ResponseDTO";
import connectDB from "@/lib/db";
import { checkSession } from "@/lib/check-session";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest,   { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    try {
        const id = (await params).id;

        const lesson = await Lesson.findById(id);
        if (!lesson) {
            const response: ResponseDTO = {
                status: 404,
                message: 'Lesson not found'
            }
            return new Response(JSON.stringify(response), { status: 404 });
        }

        const response: ResponseDTO = {
            status: 200,
            data: lesson,
            message: 'Lesson retrieved successfully'
        }
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const response: ResponseDTO = {
            status: 500,
            message: 'Failed to retrieve lesson',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
        return new Response(JSON.stringify(response), { status: 500 });
    }
}



export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await checkSession();
    if (!session || session?.user.role !== 'ADMIN') {
        const response: ResponseDTO = {
            status: 401,
            data: null,
            message: 'Unauthorized'
        }
        return new Response(JSON.stringify(response), { status: 401 });
    }
    await connectDB();
    try {
        const body: Partial<LessonRequest> = await request.json();
        const id = (await params).id;

        const updatedLesson = await Lesson.findByIdAndUpdate(id, body, { new: true });
        if (!updatedLesson) {
            const response: ResponseDTO = {
                status: 404,
                message: 'Lesson not found'
            }
            return new Response(JSON.stringify(response), { status: 404 });
        }

        const response: ResponseDTO = {
            status: 200,
            data: updatedLesson,
            message: 'Lesson updated successfully'
        }
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const response: ResponseDTO = {
            status: 500,
            message: 'Failed to update lesson',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
        return new Response(JSON.stringify(response), { status: 500 });
    }
}

export async function DELETE(request: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    const session = await checkSession();
    if (!session || session?.user.role !== 'ADMIN') {
        const response: ResponseDTO = {
            status: 401,
            data: null,
            message: 'Unauthorized'
        }
        return new Response(JSON.stringify(response), { status: 401 });
    }
    await connectDB();
    try {
        const id = (await params).id;

        const lesson = await Lesson.findById(id);
        if (!lesson) {
            const response: ResponseDTO = {
                status: 404,
                message: 'Lesson not found'
            }
            return new Response(JSON.stringify(response), { status: 404 });
        }

        // Remove lesson from course
        await Course.findByIdAndUpdate(lesson.course, { $pull: { lessons: id } });

        await Lesson.findByIdAndDelete(id);

        const response: ResponseDTO = {
            status: 200,
            message: 'Lesson deleted successfully'
        }
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const response: ResponseDTO = {
            status: 500,
            message: 'Failed to delete lesson',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
        return new Response(JSON.stringify(response), { status: 500 });
    }
}
