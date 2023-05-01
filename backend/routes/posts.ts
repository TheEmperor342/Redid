import { Router } from "express";
import postsController from "../controllers/postsController";
const router = Router();

router.post("/", postsController.post);

export default router;
