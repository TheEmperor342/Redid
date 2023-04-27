import express from "express";
import { Accounts, RefreshTokens } from "../../../schema";
import { sign } from "../../../utils";

const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
	// Get username and password from request
	const username: string = (req.body.username as String).trim();
	const password: string = (req.body.password as String).trim();

	res.setHeader("content-type", "application/json");

	// Check if username and password are provided
	if (username === "" || password === "") {
		res
			.status(400)
			.json({ status: "error", message: "username or password not provided." });
		return;
	}

	try {
		// Check if username already exists
		const usernameExists = await Accounts.exists({ username });
		if (usernameExists) {
			res.status(409).json({ status: "error", message: "username exists" });
			return;
		}

		// Create documents in db
		const accountDoc = new Accounts({
			username,
			password,
		});
		const refreshTokenDoc = new RefreshTokens({
			ownerID: accountDoc._id,
		});

		// Save documents
		await accountDoc.save();
		await refreshTokenDoc.save();

		// Create tokens
		const accessToken = sign({ username, userId: accountDoc._id });
		const refreshToken = sign(
			{ username, userId: accountDoc._id, tokenId: refreshTokenDoc._id },
			{ expiry: "7d", key: process.env.REFRESH_TOKEN_KEY! }
		);
		res.status(201).json({ status: "ok", accessToken, refreshToken });
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: "error", message: String(err) });
		return;
	}
});

export default router;
