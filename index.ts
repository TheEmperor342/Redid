import express from "express";
import signUp from "./backend/routes/sign-up";

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use("/api/signUp", signUp);
app.use(express.static("frontend"));

app.listen(3000, () => {
	console.log("App listening on port 3000");
});
