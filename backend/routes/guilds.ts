import { Router } from "express";
import guildsController from "../controllers/guildsController";
import { verifyTokenM } from "../middlewares";
const router = Router();

router.get("/", guildsController.get);
router.post("/", verifyTokenM, guildsController.post);
router.delete("/:name", verifyTokenM, guildsController.delete);

export default router;
