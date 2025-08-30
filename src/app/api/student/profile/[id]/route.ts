import { Student } from "@/model/students";
import connectDB from "@/lib/db";
import { ResponseDTO } from "@/dto/ResponseDTO";
import { checkSession } from "@/lib/check-session";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const session = await checkSession();
    if(!session) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    await connectDB();
    try {
        const id = (await params).id; // ← Lấy id từ URL
        const currentUser = await Student.findOne({ email: session.user.email! });
        if (!currentUser) {
            const response: ResponseDTO = {
                    status: 401,
                    message: 'User not found in database'
            };
            return new Response(JSON.stringify(response), { status: 401 });
        }
        if (currentUser.id !== id) {
            const response: ResponseDTO = {
                status: 403,
                message: 'Forbidden - You can only access your own profile'
            };
            return new Response(JSON.stringify(response), { status: 403 });
        }

        const user = await Student.findOne({ _id: id });

        if (!user) {
        const response: ResponseDTO = {
            status: 404,
            message: 'User not found'
        };
        return new Response(JSON.stringify(response), { status: 404 });
        }

        const response: ResponseDTO = {
            status: 200,
            data: user,
            message: 'User profile retrieved successfully'
        };
        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error: unknown) {
        const response: ResponseDTO = {
        status: 500,
        message: 'Failed to retrieve user profile',
        error: error instanceof Error ? error.message : 'Unknown error'
        };
        return new Response(JSON.stringify(response), { status: 500 });
    }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }

) {
 
  try {
    await connectDB();
    const id = (await params).id;
    const {fullname, phone, age, avatar} = await request.json();
    if(!fullname){
      return new Response(JSON.stringify({ message: 'Full name is required' }), { status: 400 });
    }
    const updatedUser = await Student.findOneAndUpdate(
      { _id: id },
      {
        fullname,
        phone: phone || null,
        age: age || null,
        avatar: avatar || null,
      },
      { new: true }
    );
    
    const response: ResponseDTO = {
      status: 200,
      data: updatedUser,
      message: 'User profile updated successfully'
    };
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error: unknown) {
    const response: ResponseDTO = {
      status: 500,
      message: 'Failed to update user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }

) {
  try {
    await connectDB();
    const id = (await params).id;

    await Student.findOneAndDelete({ _id: id });

    const response: ResponseDTO = {
      status: 200,
      message: 'User deleted successfully'
    };
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error: unknown) {
    const response: ResponseDTO = {
      status: 500,
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}