import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getDataFromToken } from "@/helpers/getDataFromToken";

const prisma = new PrismaClient();


export async function GET(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);

        const User = await prisma.user.findUnique({
            where: { authId: userId },
          });
        
        if (!User) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const dbUser = await prisma.user.findUnique({
            where: {
                id: User.id,
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
