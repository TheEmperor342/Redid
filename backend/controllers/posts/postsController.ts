import { Request, Response } from "express";
import { HttpError, errorHandler } from "../../utils";
import { jwtPayloadOverride } from "../../types";
import { Posts, Guilds } from "../../models";

const post = errorHandler(async (req: Request, res: Response) => {
	const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

	if (!req.body.title || !req.body.content || !req.body.guild)
		throw new HttpError("title, content or guild not provided", 400);

	const title = (req.body.title as String).trim();
	const content = (req.body.content as String).trim();
	const guild = (req.body.guild as String).trim();

	if (title === "" || content === "" || guild === "")
		throw new HttpError("title, content or guild not provided", 400);

	if (title.length > 30) throw new HttpError("title too long", 400);

	if (content.length > 1000) throw new HttpError("content too long", 400);

	const guildExists = await Guilds.exists({ name: guild });
	if (!guildExists) throw new HttpError("guild does not exist", 404);

	const postDoc = new Posts({
		posterId: tokenDecoded.ownerId,
		guildId: guildExists._id,
		poster: tokenDecoded.username,
		guild,
		title,
		content,
	});

	await postDoc.save();

	res.status(201).json({ status: "ok" });
});

export default {
	post,
};
