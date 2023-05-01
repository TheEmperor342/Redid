import { Request, Response } from "express";
import { verifyToken, jwtPayloadOverride } from "../../utils";
import { Tokens } from "../../models";

export default {
	delete: async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(400).json({ status: "error", message: "bad token" });
			return;
		}
		const token = authHeader.split(" ")[1];

		try {
			const tokenDecoded = await verifyToken(token);

			if (typeof tokenDecoded[0] === "number") {
				res.status(tokenDecoded[0]).json(tokenDecoded[1]);
				return;
			}
			await Tokens.deleteMany({
				owner: (tokenDecoded as jwtPayloadOverride).userId,
			});
			res.status(200).json({ status: "ok" });
		} catch (err) {
			res.status(500).json({ status: "error", message: String(err) });
		}
	},
};
