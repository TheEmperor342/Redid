import signIn from "./sign-in";
import signUp from "./sign-up";
import deleteUser from "./delete-user";

export default [
	{ router: signIn, path: "/api/sign-in" },
	{ router: signUp, path: "/api/sign-up" },
	{ router: deleteUser, path: "/api/delete-user" },
];
