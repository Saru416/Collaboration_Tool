import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

const prisma = new PrismaClient();

const getRequestingUserId = async (request: NextRequest) => {
    // This is placeholder logic — replace with real auth
    const userId = request.headers.get("x-user-id");
    return userId;
  };

export async function DELETE(
    request: NextRequest,
    { params }: { params: { roomId: string; id: string } }
  ){
    try {
        const {roomId, id: memberToRemoveId} = params;

        const reqUserId = await getRequestingUserId(request);
        if(!reqUserId){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const reqMembership = await prisma.roomMember.findFirst({
            where: {
                roomId,
                userId: reqUserId
            }
        });

        if (!reqMembership || (reqMembership.role !== "OWNER" && reqMembership.role !== "EDITOR")) {
            return NextResponse.json({ message: "Permission denied" }, { status: 403 });
        }

        const memberToRemove = await prisma.roomMember.findUnique({
            where: { id: memberToRemoveId },
            include: { user: true },
          });
      
          if (!memberToRemove || memberToRemove.roomId !== roomId) {
            return NextResponse.json({ message: "Member not found in room" }, { status: 404 });
          }
      
          if (memberToRemove.role === "OWNER") {
            return NextResponse.json({ message: "Cannot remove the room owner" }, { status: 403 });
          }
      
          await prisma.roomMember.delete({
            where: { id: memberToRemoveId },
          });
      
          return NextResponse.json({ message: "Member removed successfully" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({message: error.message}, {status: 500})
    }
}