import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';

        const decodedToken: any = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!);
        console.log("Decoded Token ------------>",decodedToken);
        return decodedToken.sub;
    } catch (error: any) {
        throw new Error(error.message);
    }
}