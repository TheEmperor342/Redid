import { Request, Response } from "express";
import { Accounts, Tokens } from "../../models";
import { HttpError, sign } from "../../utils";
import { errorHandler } from "../../utils";

/* POST /api/auth/sign-up 
 * Content-Type: application/json
 *
 * {
 *   "username": string,
 *   "password": string
 * }
 */
const post = errorHandler(async (req: Request, res: Response) => {
  res.setHeader("content-type", "application/json");
  // Get username and password from request
  if (!req.body.username || !req.body.password)
    throw new HttpError("username or password not provided", 400);

  const username = (req.body.username as String).trim();
  const password = (req.body.password as String).trim();

  // Check if username and password are provided
  if (username === "" || password === "")
    throw new HttpError("username or password not provided", 400);
	if (password.length < 5)
		throw new HttpError("Password too small", 400);
	if (username.length < 3)
		throw new HttpError("Username too small", 400);
	if (password.length > 255)
		throw new HttpError("Password too long", 413);
	if (username.length > 16)
		throw new HttpError("Username too long", 413);
  const usernameExists = await Accounts.exists({ username });
  if (usernameExists) throw new HttpError("username exists", 409);

  // Create documents in db
  const accountDoc = new Accounts({
    username,
    password,
  });
  const tokenDoc = new Tokens({
    owner: accountDoc._id,
  });

  // Save documents
  await accountDoc.save();
  await tokenDoc.save();

  // Create tokens
  const token = sign(accountDoc._id, tokenDoc._id);
  res.status(201).json({ status: "ok", token });
});
export default {
  post,
};
