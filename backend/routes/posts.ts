import { Router } from "express";
import postsController from "../controllers/postsController";
import { verifyTokenM } from "../middlewares";
const router = Router();

router.get("/", postsController.get);
router.post("/", verifyTokenM, postsController.post);
router.delete("/:postId", verifyTokenM, postsController.delete);

export default router;
