import express from "express";
import jwt from "jsonwebtoken";
import Account from "../../schema/accounts";
import { sign } from "../../utils";

const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
	const username: string = (req.body.username as String).trim();
	const password: string = (req.body.password as String).trim();

	res.setHeader("content-type", "application/json");

	if (username === "" || password === "") {
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

		const account = new Account({
			username: username,
			password: password,
		});

		const result = await account.save();

		const token = sign({ uname: username, id: result._id });
		res.status(201).json({ status: "ok", token: token });
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: "error", message: String(err) });
		return;
	}
});

export default router;
