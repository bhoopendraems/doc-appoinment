import mongoose from "mongoose";
import User from "../../../models/User";
import type {NextApiRequest, NextApiResponse} from "next";
import jwt from "jsonwebtoken";
import {MongoServerError} from "mongodb";
import {isBefore} from "date-fns";
import sendMail from "../../../lib/nodemailer";
import dbConnection from "../../../lib/dbConnection";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
){
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    const {method} = req;

    try {
        await dbConnection();
    } catch (error){
        if (error instanceof Error){
            res.status(500).json({error: error.message});
        }
    }

    switch (method){
        case "POST":
            try {
                const user = await new User(req.body);
                const savedUser = await user.save();
                const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
                const messages = [];

                if (isBefore(new Date(), savedUser.emailVerificationToken.expires)){
                    await sendMail({
                        to: user.email, // list of receivers
                        subject: "Forgot Password OTP", // Subject line
                        text: `Your OTP is ${savedUser.emailVerificationToken.token}`, // plain text body
                        html: `
                            <p>Your OTP is ${savedUser.emailVerificationToken.token}</p>
                        `, // html body
                    });

                    messages.push("Verification email sent");
                }

                res.status(201).json({
                    success: true,
                    accesstoken: token,
                    data: savedUser,
                    messages
                });
            } catch (error: unknown){
                console.log(error);

                if (error instanceof mongoose.Error.ValidationError){
                    res.status(400).json({
                        success: false,
                        message: error.message
                    });

                    return;
                }

                if (error instanceof MongoServerError){
                    if (error.code === 11000){
                        res.status(400).json({
                            success: false,
                            message: "Email already exists"
                        });
                    }

                    res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }
            }

            break;
        default:
            res.status(400).json({success: false});
            break;
    }
}
