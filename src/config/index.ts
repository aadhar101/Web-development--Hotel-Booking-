import dotenv from "dotenv";
dotenv.config();

export const PORT: number = 
    process.env.PORT ? parseInt(process.env.PORT) : 5000;

export const MONGODB_URI: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking';

export const JWT_SECRET: string = 
    process.env.JWT_SECRET || 'default_secret_change_this';

export const NODE_ENV: string = 
    process.env.NODE_ENV || 'development';