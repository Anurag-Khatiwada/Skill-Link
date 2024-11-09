import { configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import orderRoute from "./routes/orderRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();


dotenv.config();



mongoose.set('strictQuery', true);
const connect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    }catch (error){
        console.error('Error connecting to MongoDB:', error);
    }
};
app.use(cors({origin:"http://localhost:5173", credentials: true}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/orders", orderRoute);
app.use("/api/messages", messageRoute);
app.use("/api/services", serviceRoute);
app.use("/api/conversations", conversationRoute);


app.use((err, req, res, next)=>{
    const errStatus = err.status || 500;
    const errMessage = err.message || "something went wrong";
    
    return res.status(errStatus).send(errMessage);
})




app.listen(3000, ()=>{
    connect();
    console.log("Backend server is running");
});