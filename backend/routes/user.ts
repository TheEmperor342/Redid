import {Router} from "express";
import userController from "../controllers/userController";
import { verifyTokenM } from "../middlewares";
const router = Router();

router.get("/guilds", verifyTokenM, userController.getGuilds);
router.get("/posts", verifyTokenM, userController.getPosts);

export default router;
