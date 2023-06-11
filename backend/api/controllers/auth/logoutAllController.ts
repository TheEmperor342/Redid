import { Request, Response } from "express";
import { errorHandler } from "../../utils";
import { jwtPayloadOverride } from "../../types";
import { Tokens } from "../../models";

/* DELETE /api/auth/logout-all 
 * Authorization: Bearer <token>
 */
const logoutAll = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;
  await Tokens.deleteMany({
    owner: tokenDecoded.ownerId,
  });
  res.status(200).json({ status: "ok" });
});

export default {
  delete: logoutAll,
};
