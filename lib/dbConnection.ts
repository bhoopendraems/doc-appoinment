import mongoose from "mongoose";
const MONGODB_URI = "mongodb+srv://admin:Admin123@cluster0.pxwo6.mongodb.net/thera?retryWrites=true&w=majority";

declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: mongoose.Connection | mongoose.Mongoose | null,
        promise: Promise<mongoose.Connection | mongoose.Mongoose> | null,
    };
}
let cached = global.mongoose; 
 
if (!cached){
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

async function dbConnect (){
    if (!MONGODB_URI){
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env.local"
        );
    }

    if (cached.conn){
        return cached.conn;
    }
    
    if (!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;