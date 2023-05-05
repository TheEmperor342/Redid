import signIn from "./auth/sign-in";
import signUp from "./auth/sign-up";
import deleteUser from "./auth/delete-user";
import logout from "./auth/logout";
import logoutAll from "./auth/logoutAll";

import posts from "./posts/posts";
import guilds from "./guilds";

import views from "./views";

import { verifyTokenM } from "../middlewares";

import { Router } from "express";
const router = Router();

router.use("/api/auth/sign-in", signIn);
router.use("/api/auth/sign-up", signUp);
router.use("/api/auth/delete-user", verifyTokenM, deleteUser);
router.use("/api/auth/logout", verifyTokenM, logout);
router.use("/api/auth/logout-all", verifyTokenM, logoutAll);
router.use("/api/posts", verifyTokenM, posts);
router.use("/api/guilds", verifyTokenM, guilds);
router.use("/", views);

export default router;
