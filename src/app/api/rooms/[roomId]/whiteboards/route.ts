import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest, 
    {params} : {params: {roomId : string}}
){
    try {
        const {roomId} = params;
        const {data} = await request.json();

        const whiteboard = await prisma.whiteboardSession.create({
            data: {
                roomId,
                data
            }
        });

        return NextResponse.json({message: "WhiteBoard session is Created",
            data: whiteboard
            },
             {status: 201}
            )
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function GET(request: NextRequest, 
    {params} : {params: {roomId : string}}
){
    try {
        const {roomId} = params;

        const whiteboardSessions = await prisma.whiteboardSession.findMany({
            where: {
                roomId: roomId
            }
        })

        if(whiteboardSessions.length === 0){
            return NextResponse.json({message: "No sessions found!"}, {status: 404})
        }

        return NextResponse.json(whiteboardSessions);
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
    
}