import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export type jwtPayloadOverride = jwt.JwtPayload & {
	username: string;
	ownerId: any;
	tokenId: any;
};

export interface TPost {
	posterId: mongoose.Types.ObjectId;
	poster: string;
	title: string;
	content: string | undefined;
}

