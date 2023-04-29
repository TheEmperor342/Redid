import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Accounts, Tokens } from "../../../schema";

type jwtPayloadOverride = jwt.JwtPayload & {
	userId: string;
};
const router = Router();

router.delete("/", async (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		res.status(401).json({ status: "error", message: "unauthorized" });
		return;
	}
	const token = authHeader.split(" ")[1];

	const decodeToken = (): jwtPayloadOverride | number => {
		try {
			return jwt.verify(token, process.env.JWT_KEY!) as jwtPayloadOverride;
		} catch (err) {
			res.status(403).json({ status: "error", message: "forbidden" });
			return 1;
		}
	};
	try {
		const user = decodeToken();
		if (typeof user === "number") return;

		const account = await Accounts.findOne({
			_id: user.userId,
		});

		if (!account) {
			res.status(404).json({ status: "error", message: "user not found" });
			return;
		}
		await Accounts.findByIdAndDelete(user.userId);
		console.log(user);
		await Tokens.deleteMany({
			owner: user.userId,
		});

		res.status(200).json({ status: "ok" });
	} catch (err) {
		res.status(500).json({ status: "ok", message: String(err) });
		return;
	}
});

export default router;
