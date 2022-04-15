import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    appointmentDate: {
        type: String,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    appointmentType: {
        type: String,
        enum: ["Virtual", "In Person"],
        default: "In Person"
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true}
});

AppointmentSchema.virtual("doctor", {
    ref: "users",
    localField: "doctorId",
    foreignField: "_id",
    justOne: true
});

AppointmentSchema.virtual("patient", {
    ref: "users",
    localField: "patientId",
    foreignField: "_id",
    justOne: true
});

const model = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
export default model;