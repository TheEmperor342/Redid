import express from "express";
import { Accounts, Tokens } from "../../../schema";
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
		const tokenDoc = new Tokens({
			owner: accountDoc._id,
		});

		// Save documents
		await accountDoc.save();
		await tokenDoc.save();

		// Create tokens
		const token = sign(username, accountDoc._id, tokenDoc._id);
		res.status(201).json({ status: "ok", token });
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: "error", message: String(err) });
		return;
	}
});

export default router;
