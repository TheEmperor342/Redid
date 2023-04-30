import signIn from "./api/auth/sign-in";
import signUp from "./api/auth/sign-up";
import deleteUser from "./api/auth/delete-user";
import logout from "./api/auth/logout";
import logoutAll from "./api/auth/logoutAll";
import views from "./views";

import { Router } from "express";
const router = Router();

router.use("/api/auth/sign-in", signIn);
router.use("/api/auth/sign-up", signUp);
router.use("/api/auth/delete-user", deleteUser);
router.use("/api/auth/logout", logout);
router.use("/api/auth/logout-all", logoutAll);
router.use("/", views);

export default router;
