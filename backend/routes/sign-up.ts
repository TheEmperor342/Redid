import express from "express";
import jwt from "jsonwebtoken";

require("dotenv").config();
const router = express.Router();

router.post("/", (req: express.Request, res: express.Response) => {
	const username = req.body.username;
	const password = req.body.password;

	const token = jwt.sign(
		{ name: username, password: password },
		// @ts-ignore
		process.env.JWT_KEY
	);

	res.setHeader("content-type", "application/json");
	res.json(JSON.stringify({ token: token }));
});

export default router;
