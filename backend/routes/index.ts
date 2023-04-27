import signIn from "./api/auth/sign-in";
import signUp from "./api/auth/sign-up";
import deleteUser from "./api/auth/delete-user";
import views from "./views";

export default [
	{ router: signIn, path: "/api/auth/sign-in" },
	{ router: signUp, path: "/api/auth/sign-up" },
	{ router: deleteUser, path: "/api/auth/delete-user" },
	{ router: views, path: "/" },
];
