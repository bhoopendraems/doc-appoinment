import {NextApiRequest} from "next";
import jwt from "jsonwebtoken";

interface JwtPayload {
    _id: string
}
 
export default function verifyToken (req: NextApiRequest){
    try {
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
        let token = req.headers.authorization;

        if (
            typeof token != "undefined" &&
            token != null
        ){
            const barerheader = token;
            const baerer = barerheader.split(" ");
            token = baerer[1];
        }

        if (!token){
            throw new Error("Authentication token required");
        }

        const token_details = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        if (!token_details){
            throw new Error("Authentication failed");
        }

        return token_details;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any){
        return new Response(error.message, {status: 401});
    }
}