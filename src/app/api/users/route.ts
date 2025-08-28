import { UserService } from "@/service/UserService";
import { UserRequest } from "@/dto/user/UserRequest";
import { ResponseDTO } from "@/dto/ResponseDTO";

export async function GET() {
    try {
        const users = await UserService.findAllUsers();

        const response: ResponseDTO = {
            status: 200,
            data: users,
            message: 'Users retrieved successfully'
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
    try {
        const body = await request.json();
        const { email, name, password } = body as UserRequest;
        
        if(!email || !name || !password) {
            const response: ResponseDTO = {
                status: 400,
                message: 'All fields are required'
            }
            return new Response(JSON.stringify(response), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const existingUser = await UserService.findUserByEmail(email);
        if(existingUser) {
            const response: ResponseDTO = {
                status: 409,
                message: 'User already exists'
            }
            return new Response(JSON.stringify(response), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const newUser = await UserService.createUser({ email, name, password });
        
        const response: ResponseDTO = {
            status: 201,
            data: newUser,
            message: 'User created successfully'
        }
        return new Response(JSON.stringify(response), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
    const response: ResponseDTO = {
      status: 500,
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}

