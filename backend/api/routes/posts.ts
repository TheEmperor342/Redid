import { Router } from "express";
import postsController from "../controllers/postsController";
import { verifyTokenM } from "../middlewares";
const router = Router();

router.get("/", postsController.get);
router.get("/:id/isLikedByMe", verifyTokenM, postsController.isLikedByMe);
router.post("/", verifyTokenM, postsController.post);
router.delete("/:postId", verifyTokenM, postsController.delete);
router.post("/:id/like", verifyTokenM, postsController.likePost);
router.post("/:id/unlike", verifyTokenM, postsController.unlikePost);
router.patch("/:id", verifyTokenM, postsController.patch);

export default router;
