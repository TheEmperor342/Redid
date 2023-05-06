import { Router } from "express";
import postsController from "../../controllers/posts/postsController";
import { verifyTokenM } from "../../middlewares";
const router = Router();

router.post("/", verifyTokenM, postsController.post);

export default router;
