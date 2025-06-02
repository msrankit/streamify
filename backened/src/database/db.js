import mongoose from "mongoose";


export const ConnectToDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connected to MongoDB ${conn.connection.host} `);
    }catch(err){
        console.log(`Failed to connect to MongoDB: ${err}`);
        process.exit(1); // 1 means  failure
    }
}