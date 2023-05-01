import { Request, Response } from "express";
import { decodeToken } from "../../utils";
import { Accounts, Tokens } from "../../models";

export default {
	delete: async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(401).json({ status: "error", message: "unauthorized" });
			return;
		}
		const token = authHeader.split(" ")[1];

		try {
			const tokenDecoded = decodeToken(token);
			if (tokenDecoded === null) {
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

			const account = await Accounts.findOne({
				_id: tokenDecoded.ownerId,
			});

			if (!account) {
				res.status(404).json({ status: "error", message: "user not found" });
				return;
			}
			await Accounts.findByIdAndDelete(tokenDecoded.ownerId);
			await Tokens.deleteMany({
				owner: tokenDecoded.ownerId,
			});

			res.status(200).json({ status: "ok" });
		} catch (err) {
			res.status(500).json({ status: "error", message: String(err) });
			return;
		}
	},
};
