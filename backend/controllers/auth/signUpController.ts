import { Request, Response } from "express";
import { Accounts, Tokens } from "../../models";
import { HttpError, sign } from "../../utils";
import { errorHandler } from "../../utils";

const post = errorHandler(async (req: Request, res: Response) => {
	// Get username and password from request
	if (!req.body.username || !req.body.password)
		throw new HttpError("username or password not provided", 400);

	const username = (req.body.username as String).trim();
	const password = (req.body.password as String).trim();

	res.setHeader("content-type", "application/json");

	// Check if username and password are provided
	if (username === "" || password === "")
		throw new HttpError("username or password not provided", 400);

	// Check if username already exists
	const usernameExists = await Accounts.exists({ username });
	if (usernameExists) throw new HttpError("username exists", 409);

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
});
export default {
	post,
};
