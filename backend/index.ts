import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import router from "./api/routes";
import { HttpError } from "./api/utils";
import cors from "cors";

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/public", express.static("public"));

app.use("/", router);

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.error(error.message, error.code);
  res
    .status(error.code || 500)
    .json({
      status: "error",
      message: error.message || "Internet server error",
    });
});

mongoose
  .connect(process.env.MONGODB_CONN_STR!, { dbName: "Redid" })
  .then((result) => {
    console.log("Connected to mongodb database");
    app.listen(3000, () => console.log("App listening on port 3000"));
  })
  .catch((err) => console.log(err));
