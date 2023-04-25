import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign } from "../../utils";
import Accounts from "../../schema/accounts";
const router = Router();

router.post("/", async (req: Request, res: Response) => {
	const username: string = (req.body.username as String).trim();
	const password: string = (req.body.password as String).trim();

	try {
		const user = await Accounts.findOne({ username: username });
		if (!user) {
			res.status(404).json({ status: "error", message: "user not found" });
			return;
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			res.status(400).json({ status: "error", message: "invalid credentials" });
			return;
		}

		const token = sign({ username: username, id: user._id });
		res.status(200).json({ status: "ok", token: token });
	} catch (err) {
		res.status(500).json({ status: "error", message: String(err) });
	}
});

export default router;
