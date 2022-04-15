import mongoose from "mongoose";
import bcrypt from "bcrypt";
import IsEmail from "isemail";
import generateToken from "../utils/generateToken";

const UserSchema = new mongoose.Schema({
    role: { 
        type: String,
        required: true,
        enum: ["Doctor", "Patient", "Admin"],
    },
    firstName: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email: string) => IsEmail.validate(email),
            message: "Email is not valid"
        }
    },
    phone: {
        type: String,
        required: true,
        maxlength: 20,
        validate: {
            validator: (phone: string) => {
                return /^\d{10}$/.test(phone);
            },
            message: "Phone is not valid"
        }
    },
    address: {
        type: String,
        required: true,
        maxlength: 100
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"],
    },
    healthCard: {type: String},
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isHealthCardVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: {
            token: String,
            expires: Date
        },
        default: null
    },
    phoneVerificationToken: {
        type: {
            token: String,
            expires: Date
        },
        default: null
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DISABLED"],
    },
    statusUpdatedAt: {
        type: Date,
        default: Date.now
    },
    disableReason: {
        type: String,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
        validate: {
            validator: function (password: string){
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return passwordRegex.test(String(password));
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
        }
    },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
}, {
    timestamps: true,
    strict: "throw"
});

UserSchema.methods.toJSON = function (){
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    delete user.emailVerificationToken;
    delete user.phoneVerificationToken;
    return user;
};

UserSchema.pre("validate", function (){
    // parse dob string to date
    if (this.dob){
        this.dob = Date.parse(this.dob);
    }
});

UserSchema.pre("save", async function (next){
    if (this.isModified("password")){
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }

    if (this.isModified("email")){
        this.email = this.email.toLowerCase();
        this.isEmailVerified = false;
        this.emailVerificationToken = generateToken();
    }

    if (this.isModified("phone")){
        this.phone = this.phone.replace(/\D/g, "");
        this.isPhoneVerified = false;
        this.phoneVerificationToken = generateToken();
    }

    next();
});

// verify email token
UserSchema.methods.verifyEmailToken = async function (token: string){
    if (!this.emailVerificationToken){
        throw new Error("Email verification token is not set");
    }

    if (this.emailVerificationToken.token !== token){
        throw new Error("Invalid email verification token");
    }

    if (this.emailVerificationToken.expires < Date.now()){
        throw new Error("Email verification token has expired");
    }

    this.isEmailVerified = true;
    this.emailVerificationToken = null;
    await this.save({validateBeforeSave: false});
};

const model = mongoose.models.User || mongoose.model("User", UserSchema);
export default model;
