import jwt from "jsonwebtoken";

export const sign = (ownerId: any, tokenId: any): string =>
	jwt.sign({ ownerId, tokenId }, process.env.JWT_KEY!);
