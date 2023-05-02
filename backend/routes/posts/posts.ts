import { Router } from "express";
import postsController from "../../controllers/posts/postsController";
const router = Router();

router.post("/", postsController.post);

export default router;
