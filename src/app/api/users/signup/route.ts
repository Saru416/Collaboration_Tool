import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Use service role key for admin access
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    // Step 1: Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Step 2: Save user in Prisma (linked with Supabase authId)
    const newUser = await prisma.user.create({
      data: {
        authId: data.user.id,
        email,
        username,
      },
    });

    return NextResponse.json({ message: 'User created successfully!', user: newUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
