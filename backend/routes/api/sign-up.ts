import express from "express";
import jwt from "jsonwebtoken";
import Account from "../../schema/accounts";

require("dotenv").config();
const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
	const username = req.body.username;
	const password = req.body.password;

	res.setHeader("content-type", "application/json");

	if (!username || !password) {
		res
			.status(400)
			.json({ status: "error", message: "username or password not provided." });
		return;
	}

	try {
		const usernameExists = await Account.exists({ username: username });
		if (usernameExists) {
			res.status(409).json({ status: "error", message: "username exists" });
			return;
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: "error", message: String(err) });
		return;
	}

	const account = new Account({
		username: username,
		password: password,
	});

	try {
		await account.save();
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: "error", message: String(err) });
		return;
	}
	const token = jwt.sign(
		{ name: username, password: password },
		// @ts-ignore
		process.env.JWT_KEY
	);

	res.status(201).json({ status: "ok", token: token });
});

export default router;
