import { Request, Response } from "express";
import { verifyToken, jwtPayloadOverride } from "../../utils";
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
			const tokenDecoded = await verifyToken(token);

			if (typeof tokenDecoded[0] === "number") {
				res.status(tokenDecoded[0]).json(tokenDecoded[1]);
				return;
			}

			const account = await Accounts.findOne({
				_id: (tokenDecoded as jwtPayloadOverride).ownerId,
			});

			if (!account) {
				res.status(404).json({ status: "error", message: "user not found" });
				return;
			}
			await Accounts.findByIdAndDelete(
				(tokenDecoded as jwtPayloadOverride).ownerId
			);
			await Tokens.deleteMany({
				owner: (tokenDecoded as jwtPayloadOverride).ownerId,
			});

			res.status(200).json({ status: "ok" });
		} catch (err) {
			res.status(500).json({ status: "error", message: String(err) });
			return;
		}
	},
};
