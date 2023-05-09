import { Request, Response } from "express";
import { errorHandler } from "../utils";
import { Guilds, Posts } from "../models";
import { jwtPayloadOverride, TPost } from "../types";

const getGuilds = errorHandler(async (req: Request, res: Response) => {
	const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

	const guilds = await Guilds.find({ owner: tokenDecoded.ownerId });

	res.status(200).json({ status: "ok", data: guilds.map(el => el.name) });
});

const getPosts = errorHandler(async (req: Request, res: Response) => {
	const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

	const netPosts = await Posts.find({ posterId: tokenDecoded.ownerId });
	let posts: {[key: string]: TPost[]} = {};

	for (let post of netPosts) {
		const guild = post.guild;
		const postWithoutGuild: TPost = {
			posterId: post.posterId,
			poster: post.poster,
			title: post.title,
			content: post.content
		};

		if (guild in posts)
			posts[guild].push(postWithoutGuild);
		else
			posts[guild] = [postWithoutGuild];
	}

	res.status(200).json({status: "ok", data: posts});
});

export default { getGuilds, getPosts };
