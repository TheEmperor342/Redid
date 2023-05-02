import { Router } from "express";
import guildsController from "../controllers/guildsController";
const router = Router();

router.post("/", guildsController.post);
router.delete("/:name", guildsController.delete);

export default router;
