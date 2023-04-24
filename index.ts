import express from "express";
import mongoose from "mongoose";

import signUp from "./backend/routes/api/sign-up";
import signIn from "./backend/routes/api/sign-in";
import views from "./backend/routes/views";

require("dotenv").config();
const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use("/api/sign-up", signUp);
app.use("/api/sign-in", signIn);
app.use("/", views);

mongoose
	//@ts-ignore
	.connect(process.env.MONGODB_CONN_STR, { dbName: "RedditClone" })
	.then(result => {
		console.log("Connected to mongodb database");
		app.listen(3000, () => console.log("App listening on port 3000"));
	})
	.catch(err => console.log(err));
