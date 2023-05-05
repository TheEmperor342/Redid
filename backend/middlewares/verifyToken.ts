import { NextFunction, Request, Response } from "express";
import { jwtPayloadOverride } from "../types";
import jwt from "jsonwebtoken";
import { Tokens } from "../models";

export default async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		res.status(401).json({ status: "error", message: "unauthorized" });
		return;
	}
	const token = authHeader.split(" ")[1];

	let tokenDecoded: jwtPayloadOverride;

	try {
		tokenDecoded = jwt.verify(
			token,
			process.env.JWT_KEY!
		) as jwtPayloadOverride;
	} catch (err) {
		res.status(400).json({ status: "error", message: "bad token" });
		return;
	}
	const isTokenInDb = !(
		(await Tokens.findOne({ _id: tokenDecoded.tokenId })) === null
	);
	if (!isTokenInDb) {
		res.status(400).json({ status: "error", message: "bad token" });
		return;
	}

	res.locals.tokenDecoded = tokenDecoded as jwtPayloadOverride;
	next();
};
