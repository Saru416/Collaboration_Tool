import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }){
    try {
        const {roomId} = params;
        const room = await prisma.room.findUnique({
            where: {
                id: roomId,
            }
        })

        if(!room){
            return NextResponse.json({message: "Room not found"}, {status: 404});
        }

        return NextResponse.json(room);
    } catch (error: any) {
        return NextResponse.json({message: error.message},{status: 500})
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { roomId: string } }){
    try {
        const {roomId} = params;
        const room = await prisma.room.findUnique({
            where: {
                id: roomId,
            }
        });

        if(!room){
            return NextResponse.json({message: "Room not found"}, {status: 404});
        }

        await prisma.room.delete({
            where: {id: roomId},
        });

        return NextResponse.json({message: "Room deleted Successfully"}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({message: error.message},{status: 500});
    }
}