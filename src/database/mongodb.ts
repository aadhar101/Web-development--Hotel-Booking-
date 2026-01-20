import mongoose from "mongoose";
import { MONGODB_URI } from "../config";
import dns from 'dns';
import { promisify } from 'util';

const resolveSrv = promisify(dns.resolveSrv);

export async function connectDatabase() {
    try {
        console.log("🔄 Attempting to connect to MongoDB...");
        console.log("📍 Connection URI:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));

        // Test DNS resolution first
        if (MONGODB_URI.includes('mongodb+srv://')) {
            try {
                const hostname = MONGODB_URI.split('@')[1]?.split('/')[0];
                if (hostname) {
                    console.log("🔍 Testing DNS resolution for:", hostname);
                    await resolveSrv(`_mongodb._tcp.${hostname}`);
                    console.log("✅ DNS resolution successful");
                }
            } catch (dnsError: any) {
                console.error("❌ DNS Resolution Failed:", dnsError.message);
                console.error("\n🔧 DNS Troubleshooting:");
                console.error("1. Your DNS server might be blocking MongoDB SRV records");
                console.error("2. Try changing DNS to Google DNS (8.8.8.8, 8.8.4.4)");
                console.error("3. Flush DNS cache: ipconfig /flushdns");
                console.error("4. Check firewall/antivirus settings");
                console.error("5. Try using VPN or different network\n");
            }
        }

        const options = {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
        };

        await mongoose.connect(MONGODB_URI, options);
        console.log("✅ Connected to MongoDB successfully");
        console.log("📦 Database:", mongoose.connection.db?.databaseName);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });
        
    } catch (error: any) {
        console.error("❌ Database Connection Error:", error.message);
        console.error("\n🔧 Troubleshooting steps:");
        console.error("1. ⚠️  MOST COMMON: Your IP is NOT whitelisted in MongoDB Atlas");
        console.error("   → Go to: https://cloud.mongodb.com/");
        console.error("   → Network Access → Add IP Address → Allow 0.0.0.0/0");
        console.error("2. Verify credentials in .env file");
        console.error("3. Check internet connection");
        console.error("4. Try changing DNS to 8.8.8.8 (Google DNS)");
        console.error("5. Disable VPN/Proxy temporarily\n");
        
        // Don't exit immediately in development
        if (process.env.NODE_ENV !== 'production') {
            console.log("⚠️  Running in development mode - continuing without database");
            console.log("⏳ Will retry connection in 10 seconds...\n");
            setTimeout(() => connectDatabase(), 10000);
        } else {
            process.exit(1);
        }
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});