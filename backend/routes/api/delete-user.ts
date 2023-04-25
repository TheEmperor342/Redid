import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Account from "../../schema/accounts";

type jwtPayloadOverride = jwt.JwtPayload & {
	id: string;
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
			const userDb = await Account.findOne({
				_id: (user as jwtPayloadOverride).id,
			});
			if (!userDb) {
				res.status(404).json({ status: "error", message: "user not found" });
				return;
			}
			await Account.findByIdAndDelete((user as jwtPayloadOverride).id);
			res.status(200).json({ status: "ok" });
		});
	} catch (err) {
		res.status(500).json({ status: "ok", message: String(err) });
		return;
	}
});

export default router;
