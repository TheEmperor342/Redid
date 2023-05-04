import { Request, Response } from "express";
import { verifyToken, HttpError, errorHandler } from "../../utils";
import { jwtPayloadOverride } from "../../types";
import { Posts } from "../../models";

const post = errorHandler(async (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) throw new HttpError("unauthorized", 401);

	const token = authHeader.split(" ")[1];

	const title = (req.body.title as String).trim();
	const content = (req.body.content as String).trim();

	if (title === "" || content === "")
		throw new HttpError("title or content not provided", 400);

	if (title.length > 30) throw new HttpError("title too long", 400);

	if (content.length > 1000) throw new HttpError("content too long", 400);

	const tokenDecoded = await verifyToken(token);

	if (typeof tokenDecoded[0] === "number")
		throw new HttpError(tokenDecoded[1], tokenDecoded[0]);

	const postDoc = new Posts({
		poster: (tokenDecoded as jwtPayloadOverride).ownerId,
		title,
		content,
	});

	await postDoc.save();

	res.status(201).json({ status: "ok" });
});

export default {
	post,
};
