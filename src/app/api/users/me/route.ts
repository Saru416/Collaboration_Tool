import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { getDataFromToken } from "@/helpers/getDataFromToken";

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const { data: { user } } = await supabase.auth.getUser();

        const dbUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if(!dbUser){
            return NextResponse.json({error: "User not Found!"}, {status: 400})
        }

        return NextResponse.json({
            message: "User fetched successfully",
            user: {
                id: dbUser.id,
                email: dbUser.email,
                username: dbUser.username
            }
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 400})
    }
}
