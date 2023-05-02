import { Request, Response } from "express";
import { jwtPayloadOverride, verifyToken } from "../../utils";
import { Posts } from "../../models";

export default {
	post: async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(401).json({ status: "error", message: "unauthorized" });
			return;
		}
		const token = authHeader.split(" ")[1];

		const title: string = (req.body.title as String).trim();
		const content: string = (req.body.content as String).trim();

		if (title === "" || content === "") {
			res
				.status(400)
				.json({ status: "error", message: "title or content not provided." });
			return;
		}
		if (title.length > 30) {
			res.status(400).json({ status: "error", message: "title too long" });
			return;
		}
		if (content.length > 1000) {
			res.status(400).json({ status: "error", message: "content too long" });
			return;
		}

		try {
			const tokenDecoded = await verifyToken(token);

			if (typeof tokenDecoded[0] === "number") {
				res.status(tokenDecoded[0]).json(tokenDecoded[1]);
				return;
			}

			const postDoc = new Posts({
				poster: (tokenDecoded as jwtPayloadOverride).ownerId,
				title,
				content,
			});

			await postDoc.save();

			res.status(201).json({ status: "ok" });
		} catch (err) {
			res.status(500).json({ status: "error", message: String(err) });
			return;
		}
	},
};
