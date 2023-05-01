import { Request, Response } from "express";
import { decodeToken } from "../../utils";
import { Tokens } from "../../models";

export default {
	delete: async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(400).json({ status: "error", message: "bad token" });
			return;
		}
		const token = authHeader.split(" ")[1];

		const tokenDecoded = decodeToken(token);
		if (tokenDecoded === null) {
			res.status(403).json({ status: "error", message: "forbidden" });
			return;
		}

		try {
			const isTokenInDb = !(
				(await Tokens.findOne({ _id: tokenDecoded.tokenId })) === null
			);
			if (!isTokenInDb) {
				res.status(400).json({ status: "error", message: "bad token" });
				return;
			}
			await Tokens.deleteMany({ owner: tokenDecoded.userId });
			res.status(200).json({ status: "ok" });
		} catch (err) {
			res.status(500).json({ status: "error", message: String(err) });
		}
	},
};
