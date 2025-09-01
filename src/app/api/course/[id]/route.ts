import connectDB from "@/lib/db"; // Đặt lên đầu tiên
import { Course } from "@/model/courses";
import { ResponseDTO } from "@/dto/ResponseDTO";
import mongoose from "mongoose";
export const GET = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    await connectDB();
    console.log("Registered models:", mongoose.modelNames()); // Đảm bảo kết nối DB trước khi dùng model
    try {
        const id = (await params).id;
        const currentCourse = await Course.findById(id)
            .populate("lessons")
            .populate("category")
            .populate("teacher")
            .populate("students");
        if (!currentCourse) {
            const response: ResponseDTO = {
                status: 404,
                message: 'Course not found'
            };
            return new Response(JSON.stringify(response), { status: 404 });
        }
        const response: ResponseDTO = {
            status: 200,
            data: currentCourse,
            message: 'Course retrieved successfully'
        };
        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? `${error.message}\n${error.stack}` : JSON.stringify(error);
        console.error("Detailed error:", errMsg);

        const response: ResponseDTO = {
            status: 500,
            message: 'Failed to retrieve course',
            error: errMsg
        };
        return new Response(JSON.stringify(response), { status: 500 });
        }

}

