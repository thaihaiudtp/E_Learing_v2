import { Student } from "@/model/students";
import { UserRequest } from "@/dto/user/UserRequest";
import { ResponseDTO } from "@/dto/ResponseDTO";
import connectDB from "@/lib/db";
export async function GET() {
    await connectDB();
    try {
        const students = await Student.find();

        const response: ResponseDTO = {
            status: 200,
            data: students,
            message: 'Students retrieved successfully'
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
    await connectDB();
    try {
        const body = await request.json();
        const { email, full_name, password } = body as UserRequest;

        if(!email || !full_name || !password) {
            const response: ResponseDTO = {
                status: 400,
                message: 'All fields are required'
            }
            return new Response(JSON.stringify(response), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const existingUser = await Student.findOne({email: email});
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

        const newUser = await Student.create({ email, full_name, password });

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

