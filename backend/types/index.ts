import jwt from "jsonwebtoken";

export type jwtPayloadOverride = jwt.JwtPayload & {
	ownerId: any;
	tokenId: any;
};
