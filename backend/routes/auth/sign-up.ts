import { Router } from "express";
import signUpController from "../../controllers/auth/signUpController";

const router = Router();

router.post("/", signUpController.post);

export default router;
