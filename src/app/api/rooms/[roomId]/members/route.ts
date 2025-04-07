import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export async function POST(
    request: NextRequest,
    { params }: { params: { roomId: string } }
  ){
    try {
        const {roomId} = params;
        const {userId, role} = await getDataFromToken(request);

        if (!["OWNER", "EDITOR", "VIEWER"].includes(role)) {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        const existing = await prisma.roomMember.findFirst({
            where: {roomId, userId},
        });

        if(existing){
            return NextResponse.json({message: "user alreadt in Room"}, {status: 400});
        }

        const member = await prisma.roomMember.create({
            data: {
                roomId,
                userId,
                role: role as Role,
            },
        });

        return NextResponse.json({message: "Member added",data: member}, {status: 201});

    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { roomId: string } }
  ){
    try {
        const {roomId} = params;

        const members = await prisma.roomMember.find({
            where: {
                roomId: roomId
            }
        });

        if(members.length === 0){
            NextResponse.json({message: "No member found in the room"}, {status: 404})
        }

        return NextResponse.json(members);
    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
    
}