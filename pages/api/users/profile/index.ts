import User from "../../../../models/User";
import type {NextApiRequest, NextApiResponse} from "next";
import verifyToken from "../../../../lib/verifyToken";
import {JwtPayload} from "jsonwebtoken";
import dbConnection from "../../../../lib/dbConnection";

const allowedUpdates = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "password",
    "dob",
    "address"
];

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
){
    const userDetails: JwtPayload = verifyToken(req);
    const {method} = req;
    await dbConnection();

    switch (method){
        case "GET":
            try {
                const users = await User.find({_id: userDetails._id});

                res.status(200).json({
                    success: true,
                    data: users
                });
            } catch (error){
                res.status(400).json({success: false});
            }

            break;
        case "PUT":
            try {
                const updates = Object.keys(req.body);
                const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

                if (!isValidUpdate){
                    res.status(400).json({
                        success: false,
                        message: "Invalid update"
                    });

                    return;
                }

                // update user
                const user = await User.findByIdAndUpdate(userDetails._id, req.body, {new: true});

                res.status(200).json({
                    success: true,
                    data: user
                });
            } catch (error){
                res.status(400).json({success: false});
            }

            break;
        case "DELETE":
            try {
                if (!req.body.deleteReason || req.body.deleteReason.length < 10){
                    res.status(400).json({
                        success: false,
                        message: "Please provide a reason for deleting your account"
                    });
                }

                const deletePayload = {
                    status: "DISABLED",
                    disableReason: req.body.deleteReason,
                    statusUpdatedAt: new Date()
                };

                const user = await User.findByIdAndUpdate(userDetails._id, deletePayload, {new: true});

                res.status(200).json({
                    success: true,
                    data: user
                });
            } catch (error){
                res.status(400).json({success: false});
            }

            break;
        default:
            res.status(400).json({success: false});
            break;
    }
}
