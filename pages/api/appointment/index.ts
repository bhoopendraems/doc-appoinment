import dbConnect from "../../../lib/dbConnection";
import mongoose from "mongoose";
import Appointment from "../../../models/Appointment";
import User from "../../../models/Users";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
){
    const {method} = req;
    await dbConnect();
    const checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

    switch (method){
        case "GET":
            try {
                let cond = {};

                if(typeof (req.query.id) != "undefined" && req.query.id != null){
                    if(!checkForHexRegExp.test(req.query["id"] as string)){
                        res.status(400).json({
                            success: false,
                            message: "Faild to match required pattern for Appointment Id"
                        });
                    }else{
                        cond = {_id: req.query.id};
                    }
                }
                
                const appointmentdetails = await Appointment.find(cond).populate("doctor").populate("patient");

                if(appointmentdetails.length){
                    res.status(200).json({
                        success: true,
                        message: "Appointment Fetch Successfully",
                        data: appointmentdetails
                    });
                }else{
                    res.status(404).json({
                        success: false,
                        message: "Appointment is not exist"
                    });
                }
            } catch (error: any){
                console.log(error);

                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            break;
        case "POST":
            try {
                if(!checkForHexRegExp.test(req.body.doctorId)){
                    res.status(400).json({
                        success: false,
                        message: "Faild to match required pattern for Doctor Id"
                    });
                }else{
                    const doctor = await User.find({_id: req.body.doctorId});

                    if(doctor.length == 0){
                        res.status(400).json({
                            success: false,
                            message: "Doctor is not exist"
                        });
                    }
                }

                if(!checkForHexRegExp.test(req.body.patientId)){
                    res.status(400).json({
                        success: false,
                        message: "Faild to match required pattern for Patient Id"
                    });
                }else{
                    const patient = await User.find({_id: req.body.patientId});

                    if(patient.length == 0){
                        res.status(400).json({
                            success: false,
                            message: "Patient is not exist"
                        });
                    }
                }

                let appointcreate = await Appointment.create(req.body);
                appointcreate = JSON.parse(JSON.stringify(appointcreate));
                let appointmentdetails = {};

                if(typeof (appointcreate) != "undefined" && appointcreate != null){
                    // let doctorandpatientdetails = await User.find({'_id': {$in:[req.body.doctorId,req.body.patientId]}});
                    // doctorandpatientdetails = JSON.parse(JSON.stringify(doctorandpatientdetails))
                    // doctorandpatientdetails.map( (e) => {
                    //     if(e.role_id == 'doctor'){
                    //         appointcreate['doctor_details'] = e;
                    //     }
                    //     if(e.role_id == 'patient'){
                    //         appointcreate['patient_details'] = e
                    //     }
                    // })   
                    appointmentdetails = await Appointment.find({_id: appointcreate._id}).populate("doctor").populate("patient");
                }

                res.status(201).json({
                    success: true,
                    message: "Appointment Created Successfully",
                    data: appointmentdetails
                });
            } catch (error: unknown){
                if (error instanceof mongoose.Error.ValidationError){
                    res.status(400).json({
                        success: false,
                        message: error.message
                    });

                    return;
                }
            }

            break;
        case "PUT":
            try {
                if(typeof (req.body._id) != "undefined" && req.body._id != null){
                    if(!checkForHexRegExp.test(req.body["_id"] as string)){
                        res.status(400).json({
                            success: false,
                            message: "Faild to match required pattern for Appointment Id"
                        });
                    }
                }

                if(typeof (req.body.doctorId) != "undefined" && req.body.doctorId != null){
                    if(!checkForHexRegExp.test(req.body.doctorId)){
                        res.status(400).json({
                            success: false,
                            message: "Faild to match required pattern for Doctor Id"
                        });
                    }else{
                        const doctor = await User.find({_id: req.body.doctorId});

                        if(doctor.length == 0){
                            res.status(400).json({
                                success: false,
                                message: "Doctor is not exist"
                            });
                        }
                    }
                }

                if(typeof (req.body.patientId) != "undefined" && req.body.patientId != null){
                    if(!checkForHexRegExp.test(req.body.patientId)){
                        res.status(400).json({
                            success: false,
                            message: "Faild to match required pattern for Patient Id"
                        });
                    }else{
                        const patient = await User.find({_id: req.body.patientId});

                        if(patient.length == 0){
                            res.status(400).json({
                                success: false,
                                message: "Patient is not exist"
                            });
                        }
                    }
                }

                let appointupdate = await Appointment.findByIdAndUpdate(req.body._id, req.body, {new: true});
                appointupdate = JSON.parse(JSON.stringify(appointupdate));
                let appointmentdetails: string | any[] = [];

                if(typeof (appointupdate) != "undefined" && appointupdate != null){
                    appointmentdetails = await Appointment.find({_id: appointupdate._id}).populate("doctor").populate("patient");              
                }

                if(appointmentdetails.length){
                    res.status(202).json({
                        success: true,
                        message: "Appointment Created Successfully",
                        data: appointmentdetails
                    });
                }else{
                    res.status(404).json({
                        success: false,
                        message: "Appointment is not exist"
                    });
                }
            } catch (error: unknown){
                if (error instanceof mongoose.Error.ValidationError){
                    res.status(400).json({
                        success: false,
                        message: error.message
                    });

                    return;
                }
            }

            break;
        case "DELETE":
            try {
                if(typeof (req.body._id) != "undefined" && req.body._id != null){
                    if(!checkForHexRegExp.test(req.body["_id"] as string)){
                        res.status(400).json({
                            success: false,
                            message: "Faild to match required pattern for Appointment Id"
                        });
                    }
                }

                const appointmentdetails = await Appointment.find({_id: req.body._id});

                if(appointmentdetails.length){
                    const appointdelete = await Appointment.findByIdAndDelete(req.body._id);

                    res.status(202).json({
                        success: true,
                        message: "Appointment Deleted Successfully",
                        data: appointdelete
                    });
                }else{
                    res.status(404).json({
                        success: false,
                        message: "Appointment is not exist"
                    });
                }
            } catch (error: unknown){
                if (error instanceof mongoose.Error.ValidationError){
                    res.status(400).json({
                        success: false,
                        message: error.message
                    });

                    return;
                }
            }

            break;
        default:
            res.status(400).json({success: false});
            break;
    }
}