import { UserService } from "@/service/UserService";
import { ResponseDTO } from "@/dto/ResponseDTO";
import { checkSession } from "@/lib/check-session";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
    const session = await checkSession();
    if(!session) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    try {
        const { id } = await params; // ← Lấy id từ URL
        const requestId = parseInt(id);
        const currentUser = await UserService.findUserByEmail(session.user.email!);
        if (!currentUser) {
            const response: ResponseDTO = {
                    status: 401,
                    message: 'User not found in database'
            };
            return new Response(JSON.stringify(response), { status: 401 });
        }
        if (currentUser.id !== requestId) {
            const response: ResponseDTO = {
                status: 403,
                message: 'Forbidden - You can only access your own profile'
            };
            return new Response(JSON.stringify(response), { status: 403 });
        }
        
        const user = await UserService.findUserById(requestId);
        
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
    } catch (error: any) {
        const response: ResponseDTO = {
        status: 500,
        message: 'Failed to retrieve user profile',
        error: error.message
        };
        return new Response(JSON.stringify(response), { status: 500 });
    }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const updatedUser = await UserService.updateUser(parseInt(id), body);
    
    const response: ResponseDTO = {
      status: 200,
      data: updatedUser,
      message: 'User profile updated successfully'
    };
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error: any) {
    const response: ResponseDTO = {
      status: 500,
      message: 'Failed to update user profile',
      error: error.message
    };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await UserService.deleteUser(parseInt(id));
    
    const response: ResponseDTO = {
      status: 200,
      message: 'User deleted successfully'
    };
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error: any) {
    const response: ResponseDTO = {
      status: 500,
      message: 'Failed to delete user',
      error: error.message
    };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}