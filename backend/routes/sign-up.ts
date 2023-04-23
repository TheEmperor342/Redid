import express from "express";
import jwt from "jsonwebtoken";
import Account from "../schema/accounts";

require("dotenv").config();
const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
	const username = req.body.username;
	const password = req.body.password;

	res.setHeader("content-type", "application/json");

	try {
		const usernameExists = await Account.exists({ username: username });
		console.log(!usernameExists);
		if (usernameExists) {
			res.json(JSON.stringify({ status: "error", message: "username exists" }));
			return;
		}
	} catch (err) {
		console.log(err);
		return;
	}

	const account = new Account({
		username: username,
		password: password,
	});

	try {
		const result = await account.save();
	} catch (err) {
		res.json(
			JSON.stringify({ status: "error", message: "failed to save document" })
		);
		console.log(err);
		return;
	}
	const token = jwt.sign(
		{ name: username, password: password },
		// @ts-ignore
		process.env.JWT_KEY
	);

	res.json(JSON.stringify({ status: "ok", token: token }));
});

export default router;
