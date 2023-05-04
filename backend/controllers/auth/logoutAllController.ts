import { Request, Response } from "express";
import { verifyToken, HttpError, errorHandler } from "../../utils";
import { jwtPayloadOverride } from "../../types";
import { Tokens } from "../../models";

const logoutAll = errorHandler(async (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) throw new HttpError("bad token", 400);

	const token = authHeader.split(" ")[1];

	const tokenDecoded = await verifyToken(token);

	if (typeof tokenDecoded[0] === "number")
		throw new HttpError(tokenDecoded[1], tokenDecoded[0]);

	await Tokens.deleteMany({
		owner: (tokenDecoded as jwtPayloadOverride).userId,
	});
	res.status(200).json({ status: "ok" });
});

export default {
	delete: logoutAll,
};
