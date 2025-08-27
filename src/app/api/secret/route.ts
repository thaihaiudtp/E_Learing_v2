import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/with-auth';
import { getServerSession} from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
async function secretGET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if(!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ secret: 'Here be dragons' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
 
export const GET = withAuth(secretGET);