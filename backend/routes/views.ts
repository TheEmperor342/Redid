import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
	res.render("index.ejs");
});
router.get("/sign-up", (req: Request, res: Response) => {
	res.render("signUp/index.ejs");
});

export default router;
