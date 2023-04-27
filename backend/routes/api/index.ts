import signIn from "./auth/sign-in";
import signUp from "./auth/sign-up";
import deleteUser from "./auth/delete-user";

export default [
	{ router: signIn, path: "/api/auth/sign-in" },
	{ router: signUp, path: "/api/auth/sign-up" },
	{ router: deleteUser, path: "/api/auth/delete-user" },
];
