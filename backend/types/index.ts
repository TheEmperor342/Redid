import jwt from "jsonwebtoken";

export type jwtPayloadOverride = jwt.JwtPayload & {
	username: string;
	ownerId: any;
	tokenId: any;
};
