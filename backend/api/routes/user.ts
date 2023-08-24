import { Router } from "express";
import userController from "../controllers/userController";
import { verifyTokenM } from "../middlewares";
const router = Router();

router.get("/guilds", verifyTokenM, userController.getGuilds);
router.get("/posts", verifyTokenM, userController.getPosts);
router.get("/:user/posts", userController.getUserPosts);
router.get("/:user/guilds", userController.getUserGuilds);
router.patch("/username", verifyTokenM, userController.patchUsername)

export default router;
