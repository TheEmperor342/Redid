import jwt from "jsonwebtoken";

export const sign = (username: string, ownerId: any, tokenId: any): string =>
	jwt.sign({ username, ownerId, tokenId }, process.env.JWT_KEY!);
