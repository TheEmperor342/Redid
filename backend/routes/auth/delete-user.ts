import { Router } from "express";
import deleteUserController from "../../controllers/auth/deleteUserController";
const router = Router();

router.delete("/", deleteUserController.delete);

export default router;
