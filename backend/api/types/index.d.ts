import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export type jwtPayloadOverride = jwt.JwtPayload & {
	username: string;
	ownerId: any;
	tokenId: any;
};

export interface TPost {
	postId: mongoose.Types.ObjectId;
	poster: string;
	title: string;
	content: string | undefined;
};

export interface PostDoc extends mongoose.Document {
	posterId: mongoose.Types.ObjectId;
	guildId: mongoose.Types.ObjectId;
	poster: string;
	guild: string;
	title: string;
	content: string | undefined;
};

export interface GuildDoc extends mongoose.Document {
	owner: mongoose.Types.ObjectId;
	name: string;
}
