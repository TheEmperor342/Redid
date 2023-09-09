import { Router } from "express";
import { verifyTokenM } from "../../middlewares";
import deleteUserController from "../../controllers/auth/deleteUserController";
const router = Router();

router.delete("/", verifyTokenM, deleteUserController.delete);

export default router;
