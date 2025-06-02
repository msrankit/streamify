import {StreamChat}  from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_SECRET_KEY


if(!apiKey || !apiSecret){
    console.log(`api key or api secret is missing`)
}
const StreamClient = StreamChat.getInstance(apiKey , apiSecret)


export const upsertClient = async(userData) =>{
    try{
        await StreamClient.upsertUsers([userData])
        return userData;
    }catch(e){
        console.error(`failed connection with stream ${e}`)
    }
}


export const generateStreamToken = (userId) =>{
    try {


        const userIdStr = userId.toString();
        return StreamClient.createToken(userIdStr)
    }catch (e){
        console.error(`failed connection with stream ${e}`)
    }
}