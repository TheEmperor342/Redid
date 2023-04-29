import signIn from "./api/auth/sign-in";
import signUp from "./api/auth/sign-up";
import deleteUser from "./api/auth/delete-user";
import logout from "./api/auth/logout";
import logoutAll from "./api/auth/logoutAll";
import views from "./views";

export default { signIn, signUp, deleteUser, logout, views, logoutAll };
