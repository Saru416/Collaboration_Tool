import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest,
    {params} : {params: {docId: string}}
){
    try {
        const {docId} = params;
        const document = await prisma.document.findUnique({
            where: {
                id: docId
            }
        });

        if(!document){
            return NextResponse.json({message: "No Document found"}, {status: 404});
        }

        return NextResponse.json(document);
    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}

export async function PUT(request: NextRequest,
    {params} : {params: {docId: string}}
){
    try {
        const {docId} = params;
        const {title, content} = await request.json();


        const document = await prisma.document.update({
        where: {
            id: docId
        },
        data: {
            title,
            content,
            updatedAt: new Date()
        }
        });

        return NextResponse.json({ message: "Document updated", data: document });
    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}

export async function DELETE(request: NextRequest,
    {params} : {params: {docId: string}}
){
    try {
        const {docId} = params;
        const document = await prisma.document.findUnique({
            where: {
                id: docId
            }
        });

        if(!document){
            return NextResponse.json({message: "No Document found"}, {status: 404});
        }

        const deletedocument = await prisma.document.delete({
            where: {
                id: docId
            }
        });

        return NextResponse.json({message: "Document deleted!"});
    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}
