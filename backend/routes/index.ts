import signIn from "./auth/sign-in";
import signUp from "./auth/sign-up";
import deleteUser from "./auth/delete-user";
import logout from "./auth/logout";
import logoutAll from "./auth/logoutAll";

import posts from "./posts";

import views from "./views";

import { Router } from "express";
const router = Router();

router.use("/api/auth/sign-in", signIn);
router.use("/api/auth/sign-up", signUp);
router.use("/api/auth/delete-user", deleteUser);
router.use("/api/auth/logout", logout);
router.use("/api/auth/logout-all", logoutAll);
router.use("/api/posts", posts);
router.use("/", views);

export default router;
