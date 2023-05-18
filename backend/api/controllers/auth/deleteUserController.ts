import { Request, Response } from "express";
import { HttpError, errorHandler } from "../../utils";
import { jwtPayloadOverride } from "../../types";
import { Accounts, Tokens, Posts, Guilds } from "../../models";

const deleteUser = errorHandler(async (req: Request, res: Response) => {
  // Token from verifyToken middleware
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;
  const account = await Accounts.findOne({
    _id: tokenDecoded.ownerId,
  });

  if (!account) throw new HttpError("user not found", 404);

  await Accounts.findByIdAndDelete(tokenDecoded.ownerId);
  await Tokens.deleteMany({
    owner: tokenDecoded.ownerId,
  });
  await Posts.deleteMany({
    posterId: tokenDecoded.ownerId,
  });
  await Guilds.deleteMany({
    owner: tokenDecoded.ownerId,
  });

  res.status(200).json({ status: "ok" });
});

export default {
  delete: deleteUser,
};
