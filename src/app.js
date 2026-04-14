import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import bookingRoutes from './modules/booking/booking.routes.js';
import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();

app.use(express.json());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '../index.html'))
})
app.use('/api/auth', authRoutes);
app.use('/api/seats', bookingRoutes);

app.use((err,req,res,next)=> {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        success:false,
        error:err.message || "Internal Server Error"
    })
})

export default app;