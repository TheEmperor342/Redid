import { Router } from "express";
import logoutAllController from "../../controllers/auth/logoutAllController";
import { verifyTokenM } from "../../middlewares";
const router = Router();

router.delete("/", verifyTokenM, logoutAllController.delete);

export default router;
