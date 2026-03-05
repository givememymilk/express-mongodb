import type { Request, Response, NextFunction } from 'express';

import User from '../models/users.ts';

import * as user_services from '../services/users.ts';
import * as jwt_services from '../services/jwt.ts';

// Test endpoint
export async function test(req: Request, res: Response, next: NextFunction) {
    try {
        res.send('Greetings from the Test controller!');
    } catch (err) {
        next(err);
    }
}

// SIGNUP - Register a new user
export async function user_signup(req: any, res: any, next: any) {
    try {
        const { name, email, password } = req.body;
        const savedUser = await user_services.user_signup(name, email, password);

        res.status(201).json({
            message: 'User registered successfully',
            user: savedUser,
        });
    } catch (err) {
        next(err);
    }
}

// LOGIN - Authenticate user
export async function user_login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const user = await user_services.user_login(email, password);

        const token = jwt_services.sign({ userId: user._id, email: user.email }, '14d');

        res.json({
            message: 'Successfully logged in',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        next(err);
    }
}

// READ - Get user by ID
export async function user_details(req: any, res: Response, next: NextFunction) {
    try {
        const user = await user_services.user_details(req.params.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

// UPDATE - Update user by ID
export async function user_update(req: any, res: Response, next: NextFunction) {
    const auth_header: any = req.headers.authorization;

    const issuer = jwt_services.verify_token(auth_header);
    const existingUser = await User.findOne({ _id: issuer.userId });

    if (!existingUser) {
        throw new Error('User not found');
    }

    if (existingUser.role !== "admin") {
        throw new Error('You are not authorized to update user');
    }

    try {
        const updateData = { ...req.body };

        const user = await user_services.user_update(req.params.id, updateData);

        res.json({
            message: 'User updated successfully',
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
}

// DELETE - Delete user by ID
export async function user_delete(req: any, res: Response, next: NextFunction) {
    const auth_header: any = req.headers.authorization;

    const issuer = jwt_services.verify_token(auth_header);
    const existingUser = await User.findOne({ _id: issuer.userId });

    if (!existingUser) {
        throw new Error('User not found');
    }

    if (existingUser.role !== "admin") {
        throw new Error('You are not authorized to delete user');
    }
    try {
        const user = await user_services.user_delete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
}