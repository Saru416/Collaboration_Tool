import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma =  new PrismaClient();

export async function POST(request: NextRequest,
    {params} : {params: {roomId : string}}
){
    try {
        const {roomId} = params;
        const {title, content} = await request.json();

        const document = await prisma.document.create({
            data: {
                roomId,
                title,
                content
            }
        });

        return NextResponse.json({
            message: "Document Created", 
            data: document
            },
            {status: 201}
        );
    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}

export async function GET(request: NextRequest,
    {params}: {params: {roomId: string}}){
    try {
        const {roomId} = params
        const documents = await prisma.document.findMany({
            where: {
                roomId: roomId
            }
        });

        if(documents.length === 0){
            return NextResponse.json({message: "No document found in the Room"}, {status: 400})
        }

        return NextResponse.json(documents);
    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}