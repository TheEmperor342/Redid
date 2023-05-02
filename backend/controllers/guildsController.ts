import { Request, Response } from "express";
import { verifyToken, jwtPayloadOverride } from "../utils";
import { Guilds } from "../models";

const post = async (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		res.status(401).json({ status: "error", message: "unauthorized" });
		return;
	}
	const token = authHeader.split(" ")[1];

	const guildName = (req.body.name as String).trim();

	if (guildName === "") {
		res
			.status(400)
			.json({ status: "error", message: "guild name not provided." });
		return;
	}

	if (guildName.length > 16) {
		res.status(400).json({ status: "error", message: "guild name too long" });
		return;
	}

	try {
		const tokenDecoded = await verifyToken(token);

		if (typeof tokenDecoded[0] === "number") {
			res.status(tokenDecoded[0]).json(tokenDecoded[1]);
			return;
		}

		const guildsCreatedByUser = await Guilds.find({
			owner: (tokenDecoded as jwtPayloadOverride).ownerId,
		});

		if (guildsCreatedByUser.length >= 5) {
			res
				.status(403)
				.json({ status: "error", message: "user has created >= 5 guilds" });
			return;
		}

		const guildExists = await Guilds.exists({ name: guildName });
		if (guildExists) {
			res.status(409).json({ status: "error", message: "guild exists" });
			return;
		}

		const guild = new Guilds({
			owner: (tokenDecoded as jwtPayloadOverride).ownerId,
			name: guildName,
		});

		await guild.save();

		res.status(201).json({ status: "ok" });
	} catch (err) {
		res.status(500).json({ status: "error", message: String(err) });
		return;
	}
};

const deleteGuild = async (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		res.status(401).json({ status: "error", message: "unauthorized" });
		return;
	}
	const token = authHeader.split(" ")[1];

	const name = req.params.name;

	try {
		const tokenDecoded = await verifyToken(token);

		if (typeof tokenDecoded[0] === "number") {
			res.status(tokenDecoded[0]).json(tokenDecoded[1]);
			return;
		}

		const guild = await Guilds.findOne({ name });
		if (guild === null) {
			res.status(404).json({ status: "error", message: "guild not found" });
			return;
		}
		if (
			guild.owner?.toString() !== (tokenDecoded as jwtPayloadOverride).ownerId
		) {
			res.status(403).json({
				status: "error",
				message: "user is not the owner of the guild",
			});
			return;
		}
		await Guilds.deleteOne({ _id: guild._id });
		res.status(200).json({ status: "ok" });
	} catch (err) {
		res.status(500).json({ status: "error", message: String(err) });
		return;
	}
};

export default { post, delete: deleteGuild };
