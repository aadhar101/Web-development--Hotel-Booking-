import { UserModel, IUser } from "../models/user.model";

export interface IUserRepository {
    createUser(userData: Partial<IUser>): Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    getUserById(id: string): Promise<IUser | null>;
    getAllUsers(): Promise<IUser[]>;
    updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
    deleteUser(id: string): Promise<boolean>;
}

// MongoDB Implementation of UserRepository
export class UserRepository implements IUserRepository {
    
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(userData);
        return await user.save();
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        return user;
    }

    async getUserByUsername(username: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ username: username });
        return user;
    }

    async getUserById(id: string): Promise<IUser | null> {
        const user = await UserModel.findById(id);
        return user;
    }

    async getAllUsers(): Promise<IUser[]> {
        const users = await UserModel.find().select('-password'); // Exclude password
        return users;
    }

    async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        const updatedUser = await UserModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true } // Return the updated document
        ).select('-password');
        return updatedUser;
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}