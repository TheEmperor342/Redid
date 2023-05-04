import { Request, Response } from "express";
import { verifyToken, HttpError, errorHandler } from "../../utils";
import { jwtPayloadOverride } from "../../types";
import { Accounts, Tokens, Posts, Guilds } from "../../models";

const deleteUser = errorHandler(async (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) throw new HttpError("unauthorized", 401);

	const token = authHeader.split(" ")[1];
	const tokenDecoded = await verifyToken(token);

	if (typeof tokenDecoded[0] === "number")
		throw new HttpError(tokenDecoded[1], tokenDecoded[0]);

	const account = await Accounts.findOne({
		_id: (tokenDecoded as jwtPayloadOverride).ownerId,
	});

	if (!account) throw new HttpError("user not found", 404);

	await Accounts.findByIdAndDelete(
		(tokenDecoded as jwtPayloadOverride).ownerId
	);
	await Tokens.deleteMany({
		owner: (tokenDecoded as jwtPayloadOverride).ownerId,
	});
	await Posts.deleteMany({
		owner: (tokenDecoded as jwtPayloadOverride).ownerId,
	});
	await Guilds.deleteMany({
		owner: (tokenDecoded as jwtPayloadOverride).ownerId,
	});

	res.status(200).json({ status: "ok" });
});

export default {
	delete: deleteUser,
};
