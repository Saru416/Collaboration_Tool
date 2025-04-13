import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getDataFromToken } from "@/helpers/getDataFromToken";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const user = await prisma.user.findUnique({
      where: { authId: userId },
    });
    
    const { name } = await request.json();

    const newRoom = await prisma.room.create({
      data: {
        name,
        ownerId: user?.id || "",
      },
      include: {
        owner: true,
      },
    });    

    await prisma.roomMember.create({
      data: {
        roomId: newRoom.id,
        userId: user?.id || "",
        role: "OWNER",
      },
    });

    return NextResponse.json({ message: "Room has been created", data: newRoom });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const user = await prisma.user.findUnique({
      where: { authId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rooms = await prisma.room.findMany({
      where: {
        ownerId: user.id,
      },
    });

    return NextResponse.json(rooms);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
