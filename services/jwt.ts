import type { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';


export function verify_token(auth_header: any) {
	if (!auth_header) {
		throw new Error("No token provided");
	}

	const token: any = auth_header.split(" ")[1];

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const user: any = decoded; // attach payload to request
		return user;
	} catch (err) {
		throw new Error("Invalid or expired token");
	}
}

export function sign(payload: JwtPayload, token_duration: any) {
	if (!payload) {
		throw new Error("Payload is required");
	}
	const token: string = jwt.sign(
		payload,
		JWT_SECRET,
		{ expiresIn: token_duration || '7d' }
	)
	return token;
}
