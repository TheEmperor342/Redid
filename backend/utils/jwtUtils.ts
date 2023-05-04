import jwt from "jsonwebtoken";
import { Tokens } from "../models";
import { jwtPayloadOverride } from "../types";

export const sign = (username: string, ownerId: any, tokenId: any): string =>
	jwt.sign({ username, ownerId, tokenId }, process.env.JWT_KEY!);

// Decode a JWT
export async function verifyToken(
	token: string
): Promise<jwtPayloadOverride | [number, string]> {
	let tokenDecoded: jwtPayloadOverride;
	try {
		tokenDecoded = jwt.verify(
			token,
			process.env.JWT_KEY!
		) as jwtPayloadOverride;
	} catch (err) {
		return [400, "bad token"];
	}
	const isTokenInDb = !(
		(await Tokens.findOne({ _id: tokenDecoded.tokenId })) === null
	);
	if (!isTokenInDb) return [400, "bad token"];

	return tokenDecoded;
}
