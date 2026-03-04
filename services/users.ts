import User from '../models/users.ts';
import bcrypt from 'bcryptjs';

export async function user_signup(name: string, email: string, password: string) {
    if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    const savedUser = await user.save();

    return {
        message: 'User registered successfully',
        user: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: "user",
        },
    };
}

// LOGIN - Authenticate user
export async function user_login(email: string, password: string) {

    // Validate input
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Invalid email or password');
    }

    return user;
}

// READ - Get user by ID
export async function user_details(id: string) {
    const user = await User.findById(id).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

// UPDATE - Update user by ID
export async function user_update(id: string, updateData: any) {
    delete updateData.password;
    const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedUser;
}

// DELETE - Delete user by ID
export async function user_delete(id: string) {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
}