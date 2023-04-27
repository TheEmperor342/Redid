import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Accounts, RefreshTokens } from "../../../schema";

type jwtPayloadOverride = jwt.JwtPayload & {
	userId: string;
};
const router = Router();

router.delete("/", (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		res.status(401).json({ status: "error", message: "unauthorized" });
		return;
	}
	const token = authHeader.split(" ")[1];
	try {
		jwt.verify(token, process.env.JWT_KEY!, async (err, user) => {
			if (err) {
				res.status(403).json({ status: "error", message: "forbidden" });
				return;
			}
			const account = await Accounts.findOne({
				_id: (user as jwtPayloadOverride).userId,
			});

			if (!account) {
				res.status(404).json({ status: "error", message: "user not found" });
				return;
			}
			await Accounts.findByIdAndDelete((user as jwtPayloadOverride).userId);
			console.log(user);
			await RefreshTokens.deleteMany({
				owner: (user as jwtPayloadOverride).userId,
			});

			res.status(200).json({ status: "ok" });
		});
	} catch (err) {
		res.status(500).json({ status: "ok", message: String(err) });
		return;
	}
});

export default router;
