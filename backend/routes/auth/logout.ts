import { Router } from "express";
import logoutController from "../../controllers/auth/logoutController";
import { verifyTokenM } from "../../middlewares";
const router = Router();

router.delete("/", verifyTokenM, logoutController.delete);

export default router;
