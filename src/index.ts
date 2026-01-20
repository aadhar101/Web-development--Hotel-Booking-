import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { connectDatabase } from './database/mongodb';
import { PORT } from './config';
import authRoutes from "./routes/auth.route";

const app: Application = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Your Next.js frontend URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ 
        success: true, 
        message: "Hotel Booking API is running",
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Start server
async function startServer() {
    try {
        await connectDatabase();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();