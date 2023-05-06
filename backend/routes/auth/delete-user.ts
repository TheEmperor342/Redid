import { Router } from "express";
import deleteUserController from "../../controllers/auth/deleteUserController";
import { verifyTokenM } from "../../middlewares";
const router = Router();

router.delete("/", verifyTokenM, deleteUserController.delete);

export default router;
