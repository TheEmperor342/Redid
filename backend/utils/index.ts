import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Sign a JWT
export const sign = (username: string, ownerId: any, tokenId: any): string =>
	jwt.sign({ username, ownerId, tokenId }, process.env.JWT_KEY!);

// Decode a JWT
type jwtPayloadOverride = jwt.JwtPayload & {
	ownerId: any;
	tokenId: any;
};
export function decodeToken(token: string): jwtPayloadOverride | null {
	try {
		return jwt.verify(token, process.env.JWT_KEY!) as jwtPayloadOverride;
	} catch (err) {
		return null;
	}
}
