import { Request, Response } from "express";
import { HttpError, errorHandler } from "../utils";
import { jwtPayloadOverride } from "../types";
import { Guilds, Posts } from "../models";

const post = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  if (!req.body.name) throw new HttpError("guild name not provided", 400);

  const guildName = (req.body.name as String).trim();

  if (guildName === "") throw new HttpError("guild name not provided", 400);
  if (guildName.length > 16) throw new HttpError("guild name too long", 400);

  const guildsCreatedByUser = await Guilds.find({
    owner: tokenDecoded.ownerId,
  });

  if (guildsCreatedByUser.length >= 5)
    throw new HttpError("user has created >= 5 guilds", 403);

  const guildExists = await Guilds.exists({ name: guildName });

  if (guildExists) throw new HttpError("guild exists", 409);

  const guild = new Guilds({
    owner: tokenDecoded.ownerId,
    name: guildName,
  });

  await guild.save();

  res.status(201).json({ status: "ok" });
});

// ================== //

const deleteGuild = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const name = req.params.name;

  const guild = await Guilds.findOne({ name });
  if (guild === null) throw new HttpError("guild not found", 404);

  if (guild.owner?.toString() !== tokenDecoded.ownerId)
    throw new HttpError("user is not the owner of the guild", 403);

  await Guilds.deleteOne({ _id: guild._id });
  await Posts.deleteMany({ guildId: guild._id });
  res.status(200).json({ status: "ok" });
});

// ================== //

const get = errorHandler(async (req: Request, res: Response) => {
  const number: number = Number(req.query.number ?? 5);
  if (isNaN(number))
    throw new HttpError("Please provide an appropriate number", 400);
  if (number < 1 || number > 15)
    throw new HttpError("number cannot be < 1 or > 15", 400);

  const posts = await Guilds.find().sort({ _id: -1 }).limit(number);

  res.status(200).json({
    status: "ok",
    data: posts.map((el) => {
      return {
        owner: el.owner,
        name: el.name,
      };
    }),
  });
});

export default { get, post, delete: deleteGuild };
