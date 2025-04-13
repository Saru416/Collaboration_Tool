import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

const prisma = new PrismaClient();

// Expose socket from global object
const io = (global as any).io as Server;

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { content, senderId } = await request.json();
    const { roomId } = params;

    if (!content || !senderId) {
      return NextResponse.json(
        { message: "Missing content or senderId" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        roomId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // Emit to the room via socket
    if (io) {
      io.to(roomId).emit("receive-message", newMessage);
    }

    return NextResponse.json({ message: "Message sent", data: newMessage });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
){
  try {
    const {roomId} = params;

    const messages = await prisma.message.findMany({
      where: {
        roomId: roomId,
      }
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({message: error.message}, {status: 500})
  }
}