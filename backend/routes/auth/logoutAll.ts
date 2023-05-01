import { Router } from "express";
import logoutController from "../../controllers/auth/logoutController";
const router = Router();

router.delete("/", logoutController.delete);

export default router;
