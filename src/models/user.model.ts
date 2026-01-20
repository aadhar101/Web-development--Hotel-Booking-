import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";

const UserSchema: Schema = new Schema<UserType>(
    {
        name: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true,
            lowercase: true,
            trim: true
        },
        phoneNo: { 
            type: String, 
            required: true 
        },
        country: { 
            type: String, 
            required: true 
        },
        username: { 
            type: String, 
            required: true, 
            unique: true,
            trim: true
        },
        password: { 
            type: String, 
            required: true 
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

// Interface combining UserType and Document
export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Export the Mongoose model
export const UserModel = mongoose.model<IUser>('User', UserSchema);