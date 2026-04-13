import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import bookingRoutes from './modules/booking/booking.routes.js';
import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';
import authRoutes  from './modules/auth/auth.routes.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '../index.html'))
})
app.use('/api/auth', authRoutes);
app.use('/', bookingRoutes);

export default app;