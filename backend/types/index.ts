import jwt from "jsonwebtoken";
import { Request } from "express";

export type jwtPayloadOverride = jwt.JwtPayload & {
	ownerId: any;
	tokenId: any;
};

export type RequestOverride = Request & {
	tokenDecoded: jwtPayloadOverride;
};
