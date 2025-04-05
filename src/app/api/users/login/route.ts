import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Step 1: Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const authId = data.user.id; // UUID from Supabase Auth

    // Step 2: Find user in Prisma
    const user = await prisma.user.findUnique({
      where: { authId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = data.session?.access_token;

    const response = NextResponse.json({
        message: 'Login successful',
        user,
    })

    response.cookies.set('token',token!, {
        httpOnly: true,
        maxAge: 60*60*24*7,
    })

    return response;
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
