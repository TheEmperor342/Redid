import express from "express";
import mongoose from "mongoose";
import routers from "./backend/routes";

require("dotenv").config();
const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static("public"));

app.use("/api/auth/sign-in", routers.signIn);
app.use("/api/auth/sign-up", routers.signUp);
app.use("/api/auth/delete-user", routers.deleteUser);
app.use("/api/auth/logout", routers.logout);
app.use("/api/auth/logout-all", routers.logoutAll);
app.use("/", routers.views);

mongoose
	.connect(process.env.MONGODB_CONN_STR!, { dbName: "RedditClone" })
	.then(result => {
		console.log("Connected to mongodb database");
		app.listen(3000, () => console.log("App listening on port 3000"));
	})
	.catch(err => console.log(err));
