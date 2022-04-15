import User from "../../../../models/User";
import type {NextApiRequest, NextApiResponse} from "next";
import verifyToken from "../../../../lib/verifyToken";
import {JwtPayload} from "jsonwebtoken";
import dbConnection from "../../../../lib/dbConnection";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
){
    const userDetails: JwtPayload = verifyToken(req);
    const {method} = req;
    await dbConnection();

    switch (method){
        case "POST":
            try {
                if (!req.body.token){
                    res.status(400).json({
                        success: false,
                        message: "Token is required"
                    });

                    return;
                }

                const user = await User.findById(userDetails._id);
                console.log(userDetails._id, user);

                if (!user){
                    res.status(400).json({
                        success: false,
                        message: "User not found"
                    });
                }

                await user.verifyEmailToken(req.body.token);

                res.status(200).json({
                    success: true,
                    data: user,
                    message: "Email verified",
                });
            } catch (error){
                if (error instanceof Error){
                    res.status(400).json({
                        success: false,
                        message: error.message
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Invalid token"
                    });
                }
            }

            break;
        default:
            res.status(400).json({success: false});
            break;
    }
}
