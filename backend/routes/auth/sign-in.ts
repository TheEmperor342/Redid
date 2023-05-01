import { Router } from "express";
import signInController from "../../controllers/api/auth/signInController";
const router = Router();

router.post("/", signInController.post);

export default router;
