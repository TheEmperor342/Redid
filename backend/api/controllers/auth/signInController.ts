import { Request, Response } from "express";
import { Accounts, Tokens } from "../../models";
import { HttpError, errorHandler, sign } from "../../utils";
import bcrypt from "bcrypt";

const post = errorHandler(async (req: Request, res: Response) => {
	if (!req.body.username || !req.body.password)
		throw new HttpError("username or password not provided", 400);

	const username = (req.body.username as String).trim();
	const password = (req.body.password as String).trim();

	if (username === "" || password === "")
		throw new HttpError("username or password not provided", 400);

	const account = await Accounts.findOne({ username })
		.select("+password")
		.exec();
	if (!account) throw new HttpError("user not found", 404);

	const match = await bcrypt.compare(password, account.password);
	if (!match) throw new HttpError("invalid credentials", 400);

	const tokens = await Tokens.find({ owner: account._id }).sort({
		_id: -1,
	});
	if (tokens.length > 5)
		await Tokens.deleteMany({
			_id: { $in: tokens.slice(5).map(el => el._id) },
		});

	const tokensDoc = new Tokens({ owner: account._id });
	await tokensDoc.save();

	const token = sign(username, account._id, tokensDoc._id);

	res.status(200).json({ status: "ok", token });
});

export default {
	post,
};
