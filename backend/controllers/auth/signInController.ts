import { Request, Response } from "express";
import { Accounts, Tokens } from "../../models";
import { sign } from "../../utils";
import bcrypt from "bcrypt";

export default {
	post: async (req: Request, res: Response) => {
		const username: string = (req.body.username as String).trim();
		const password: string = (req.body.password as String).trim();

		try {
			const account = await Accounts.findOne({ username })
				.select("+password")
				.exec();

			if (!account) {
				res.status(404).json({ status: "error", message: "user not found" });
				return;
			}
			const match = await bcrypt.compare(password, account.password);
			if (!match) {
				res
					.status(400)
					.json({ status: "error", message: "invalid credentials" });
				return;
			}

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
		} catch (err) {
			res.status(500).json({ status: "error", message: String(err) });
		}
	},
};
