import connectDB from "@/lib/db"; // Đặt lên đầu tiên
import { Course } from "@/model/courses";
import { ResponseDTO } from "@/dto/ResponseDTO";

export const GET = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    await connectDB(); // Đảm bảo kết nối DB trước khi dùng model
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
        const response: ResponseDTO = {
            status: 500,
            message: 'Failed to retrieve course',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
        return new Response(JSON.stringify(response), { status: 500 });
    }
}

// export const PUT = async (
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }

// ) => {
 
//   try {
//     await connectDB();
//     const id = (await params).id;
//     const {fullname, phone, age, avatar} = await request.json();
//     if(!fullname){
//       return new Response(JSON.stringify({ message: 'Full name is required' }), { status: 400 });
//     }
//     const updatedUser = await Student.findOneAndUpdate(
//       { _id: id },
//       {
//         fullname,
//         phone: phone || null,
//         age: age || null,
//         avatar: avatar || null,
//       },
//       { new: true }
//     );
    
//     const response: ResponseDTO = {
//       status: 200,
//       data: updatedUser,
//       message: 'User profile updated successfully'
//     };
//     return new Response(JSON.stringify(response), { status: 200 });
//   } catch (error: unknown) {
//     const response: ResponseDTO = {
//       status: 500,
//       message: 'Failed to update user profile',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//     return new Response(JSON.stringify(response), { status: 500 });
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }

// ) {
//   try {
//     await connectDB();
//     const id = (await params).id;

//     await Student.findOneAndDelete({ _id: id });

//     const response: ResponseDTO = {
//       status: 200,
//       message: 'User deleted successfully'
//     };
//     return new Response(JSON.stringify(response), { status: 200 });
//   } catch (error: unknown) {
//     const response: ResponseDTO = {
//       status: 500,
//       message: 'Failed to delete user',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//     return new Response(JSON.stringify(response), { status: 500 });
//   }
// }