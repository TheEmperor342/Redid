import { Router } from "express";
import { verifyTokenM } from "../middlewares";
import postsController from "../controllers/postsController";
const router = Router();

router.get("/", postsController.get);
router.get("/:id", verifyTokenM, postsController.getSpecificPostInfo);
router.get("/:id/isLikedByMe", verifyTokenM, postsController.isLikedByMe);
router.post("/", verifyTokenM, postsController.post);
router.delete("/:postId", verifyTokenM, postsController.delete);
router.post("/:id/like", verifyTokenM, postsController.likePost);
router.post("/:id/dislike", verifyTokenM, postsController.dislikePost);
router.patch("/:id", verifyTokenM, postsController.patch);

export default router;
