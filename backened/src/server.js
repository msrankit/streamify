import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoute from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import {ConnectToDB} from "./database/db.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
const app = express();
const Port = process.env.PORT;


const __dirname = path.resolve()

app.use(express.json());
app.use(cors({
    origin: ' http://localhost:5173',
    credentials: true,
}))
app.use(cookieParser());
app.use('/api/auth' , authRoute  );
app.use('/api/users' , userRoute )
app.use('/api/chat' , chatRoute)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontened/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontened' , 'dist','index.html'));
    })
}


app.listen(Port, () => {
    console.log(`server is running on port: ${Port}`);
    ConnectToDB()
})