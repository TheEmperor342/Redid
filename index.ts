import express from "express";
import mongoose from "mongoose";
import { signIn, signUp, deleteUser, views } from "./backend/routes";

require("dotenv").config();
const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static("public"));

app.use("/api/auth/sign-in", signIn);
app.use("/api/auth/sign-up", signUp);
app.use("/api/auth/delete-user", deleteUser);
app.use("/", views);

mongoose
	.connect(process.env.MONGODB_CONN_STR!, { dbName: "RedditClone" })
	.then(result => {
		console.log("Connected to mongodb database");
		app.listen(3000, () => console.log("App listening on port 3000"));
	})
	.catch(err => console.log(err));
