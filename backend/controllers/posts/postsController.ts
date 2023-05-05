import { Request, Response } from "express";
import { HttpError, errorHandler } from "../../utils";
import { jwtPayloadOverride } from "../../types";
import { Posts } from "../../models";

const post = errorHandler(async (req: Request, res: Response) => {
	const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

	if (!req.body.title || !req.body.content)
		throw new HttpError("title or content not provided", 400);

	const title = (req.body.title as String).trim();
	const content = (req.body.content as String).trim();

	if (title === "" || content === "")
		throw new HttpError("title or content not provided", 400);

	if (title.length > 30) throw new HttpError("title too long", 400);

	if (content.length > 1000) throw new HttpError("content too long", 400);

	const postDoc = new Posts({
		poster: tokenDecoded.ownerId,
		title,
		content,
	});

	await postDoc.save();

	res.status(201).json({ status: "ok" });
});

export default {
	post,
};
