import { Request, Response } from "express";
import { verifyToken, HttpError, errorHandler } from "../utils";
import { jwtPayloadOverride } from "../types";
import { Guilds } from "../models";

const post = errorHandler(async (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) throw new HttpError("unauthorized", 401);
	const token = authHeader.split(" ")[1];

	const guildName = (req.body.name as String).trim();

	if (guildName === "") throw new HttpError("guild name not provided", 400);

	if (guildName.length > 16) throw new HttpError("guild name too long", 400);

	const tokenDecoded = await verifyToken(token);

	if (typeof tokenDecoded[0] === "number")
		throw new HttpError(tokenDecoded[1], tokenDecoded[0]);

	const guildsCreatedByUser = await Guilds.find({
		owner: (tokenDecoded as jwtPayloadOverride).ownerId,
	});

	if (guildsCreatedByUser.length >= 5)
		throw new HttpError("user has created >= 5 guilds", 403);

	const guildExists = await Guilds.exists({ name: guildName });

	if (guildExists) throw new HttpError("guild exists", 409);

	const guild = new Guilds({
		owner: (tokenDecoded as jwtPayloadOverride).ownerId,
		name: guildName,
	});

	await guild.save();

	res.status(201).json({ status: "ok" });
});

const deleteGuild = async (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) throw new HttpError("unauthorized", 401);
	const token = authHeader.split(" ")[1];

	const name = req.params.name;

	const tokenDecoded = await verifyToken(token);

	if (typeof tokenDecoded[0] === "number")
		throw new HttpError(tokenDecoded[1], tokenDecoded[0]);

	const guild = await Guilds.findOne({ name });
	if (guild === null) throw new HttpError("guild not found", 404);

	if (guild.owner?.toString() !== (tokenDecoded as jwtPayloadOverride).ownerId)
		throw new HttpError("user is not the owner of the guild", 403);

	await Guilds.deleteOne({ _id: guild._id });
	res.status(200).json({ status: "ok" });
};

export default { post, delete: deleteGuild };
