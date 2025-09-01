import { Lesson } from "@/model/lesson";
import { Course } from "@/model/courses";
import { LessonRequest } from "@/types/lesson/type";
import { ResponseDTO } from "@/dto/ResponseDTO";
import connectDB from "@/lib/db";
import { checkSession } from "@/lib/check-session";
export async function GET() {
    await connectDB();
    try {
        const lessons = await Lesson.find();

        const response: ResponseDTO = {
            status: 200,
            data: lessons,
            message: 'Lessons retrieved successfully'
        }
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const response: ResponseDTO = {
        status: 500,
        message: 'Failed',
        error: error instanceof Error ? error.message : 'Unknown error'
        };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}

export async function POST(request: Request) {
    const session = await checkSession();
    if(!session || session?.user.role !== 'ADMIN') {
        const response: ResponseDTO = {
            status: 401,
            data: null,
            message: 'Unauthorized'
        }
        return new Response(JSON.stringify(response), { status: 401 });
    }
    await connectDB();
    try {
        const body: LessonRequest = await request.json();

        if(!body.title || !body.videoUrl || !body.fileUrl || !body.duration  || !body.course) {
            const response: ResponseDTO = {
                status: 400,
                message: 'All fields are required'
            }
            return new Response(JSON.stringify(response), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const course = await Course.findById({_id: body.course});
        if(!course) {
            const response: ResponseDTO = {
                status: 404,
                message: 'Course not found'
            }
            return new Response(JSON.stringify(response), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const newLesson = await Lesson.create(body);
        await Course.findByIdAndUpdate(course._id, { $push: { lessons: newLesson._id } }, { new: true });
        const response: ResponseDTO = {
            status: 201,
            data: newLesson,
            message: 'Lesson created successfully'
        }
        return new Response(JSON.stringify(response), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
    const response: ResponseDTO = {
      status: 500,
      message: 'Failed to create lesson',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}

