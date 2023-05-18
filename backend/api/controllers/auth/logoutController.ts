import { Request, Response } from "express";
import { errorHandler } from "../../utils";
import { jwtPayloadOverride } from "../../types";
import { Tokens } from "../../models";

const logout = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  await Tokens.findOneAndDelete({
    _id: tokenDecoded.tokenId,
  });
  res.status(200).json({ status: "ok" });
});

export default {
  delete: logout,
};
