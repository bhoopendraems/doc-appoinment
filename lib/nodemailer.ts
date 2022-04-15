import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface Cached {
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null;
    promise: Promise<
        nodemailer.Transporter<SMTPTransport.SentMessageInfo>
    > | null;
}

interface EmailCredentials {
    user: string;
    pass: string;
}

declare global {
    // eslint-disable-next-line no-var
    var transporter: Cached;
}
let cached = global.transporter;

if (!cached){
    cached = global.transporter = {
        transporter: null,
        promise: null,
    };
}

const sendMail = async (mailOptions: nodemailer.SendMailOptions) => {
    const transporter = await getTransporter();

    return transporter
        .sendMail({
            from: getMailer(), // sender address
            ...mailOptions,
        })
        .then((info) => {
            if (process.env.NODE_ENV === "development")
                console.log(
                    "Message sent: %s",
                    nodemailer.getTestMessageUrl(info)
                );
            return info;
        });
};

export default sendMail;

async function getTransporter (){
    if (cached.transporter){
        console.log("returning cached transporter");
        return cached.transporter;
    }

    console.log("creating new transporter");

    if (!cached.promise){
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        const emailAccount: EmailCredentials =
            process.env.NODE_ENV === "development"
                ? await nodemailer.createTestAccount()
                : getEmailCredentials();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: emailAccount.user, // generated ethereal user
                pass: emailAccount.pass, // generated ethereal password
            },
        });

        cached.promise = Promise.resolve(transporter);
    }

    cached.transporter = await cached.promise;
    return cached.transporter;
}

function getEmailCredentials (){
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS){
        return {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        };
    }

    throw new Error("EMAIL_USER and EMAIL_PASS are not defined");
}

function getMailer (){
    if (!process.env.MAILER_EMAIL){
        if (process.env.NODE_ENV !== "development"){
            throw new Error("MAILER_EMAIL is not defined");
        }
    }

    if (!process.env.MAILER_NAME){
        return process.env.MAILER_EMAIL;
    }

    return `${process.env.MAILER_NAME} <${process.env.MAILER_EMAIL || process.env.EMAIL_USER}>`;
}