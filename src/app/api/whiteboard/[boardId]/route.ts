import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest,
    {params} : {params: {boardId: string}}
){
    try {
        const {boardId} = params;
        const whiteboard = await prisma.whiteboardSession.findUnique({
            where: {
                id: boardId
            }
        });

        if(!whiteboard){
            return NextResponse.json({message: "No WhiteBoard found"}, {status: 404});
        }

        return NextResponse.json(whiteboard);
    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}

export async function PUT(request: NextRequest,
    {params} : {params: {boardId: string}}
){
    try {
        const {boardId} = params;
        const {data} = await request.json();


        const whiteboard = await prisma.whiteboardSession.update({
        where: {
            id: boardId
        },
        data: {
            data,
        }
        });

        return NextResponse.json({ message: "WhiteBoard updated", data: whiteboard});
    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}

export async function DELETE(request: NextRequest,
    {params} : {params: {boardId: string}}
){
    try {
        const {boardId} = params;
        const whiteboard = await prisma.document.findUnique({
            where: {
                id: boardId
            }
        });

        if(!whiteboard){
            return NextResponse.json({message: "No WhiteBoard found"}, {status: 404});
        }

        const deletewhiteboard = await prisma.whiteboardSession.delete({
            where: {
                id: boardId
            }
        });

        return NextResponse.json({message: "WhiteBoard deleted!", data: deletewhiteboard});
    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}
