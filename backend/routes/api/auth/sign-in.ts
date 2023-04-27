import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign } from "../../../utils";
import { Accounts, RefreshTokens } from "../../../schema";
const router = Router();

router.post("/", async (req: Request, res: Response) => {
	const username: string = (req.body.username as String).trim();
	const password: string = (req.body.password as String).trim();

	try {
		const accountDoc = await Accounts.findOne({ username })
			.select("+password")
			.exec();

		if (!accountDoc) {
			res.status(404).json({ status: "error", message: "user not found" });
			return;
		}
		const match = await bcrypt.compare(password, accountDoc.password);
		if (!match) {
			res.status(400).json({ status: "error", message: "invalid credentials" });
			return;
		}

		const refreshTokenDoc = new RefreshTokens({ owner: accountDoc._id });
		await refreshTokenDoc.save();

		const accessToken = sign({ username, userId: accountDoc._id });
		const refreshToken = sign(
			{ username, userId: accountDoc._id, tokenId: refreshTokenDoc._id },
			{ expiry: "7d", key: process.env.REFRESH_TOKEN_KEY! }
		);

		res.status(200).json({ status: "ok", accessToken, refreshToken });
	} catch (err) {
		res.status(500).json({ status: "error", message: String(err) });
	}
});

export default router;
