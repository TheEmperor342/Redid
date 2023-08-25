import { Request, Response } from "express";
import { HttpError, errorHandler } from "../utils";
import { Guilds, Posts, Accounts } from "../models";
import {
  jwtPayloadOverride,
  TPost,
  GuildDoc,
  PopulatedPostDoc,
} from "../types";

/* GET /api/user/guilds
 * Authorization: Bearer <token>
 */
const getUsername = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const user = await Accounts.find({ _id: tokenDecoded.ownerId });
  if (user.length === 0)
    throw new HttpError(
      "Cannot find account associated with the corresponding token",
      400,
    );

  res.status(200).json({ status: "ok", username: user[0].username });
});
const getGuilds = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const guilds = await Guilds.find({ owner: tokenDecoded.ownerId });

  res.status(200).json({ status: "ok", data: guilds.map((el) => el.name) });
});

/* GET /api/user/posts
 * Authorization: Bearer <token>
 */
// This is to get posts of the current user
const getPosts = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const netPosts = (await Posts.find({
    posterId: tokenDecoded.ownerId,
  })
    .sort({ _id: -1 })
    .populate("posterId")) as PopulatedPostDoc[];

  res.status(200).json({
    status: "ok",
    data: (req.query.flattened === "true" ? true : false)
      ? netPosts.map((el) => ({
          _id: el._id,
          poster: el.posterId.username,
          guild: el.guild,
          title: el.title,
          content: el.content,
          likes: el.likedBy.length,
        }))
      : beautifyPosts(netPosts),
  });
});

/*
 * PATCH /api/user
 * Authorization: Bearer <token>
 * {
 *    "username": "newUsername"
 * }
 */
// To update username
const patchUsername = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;
  const user = await Accounts.find({ _id: tokenDecoded.ownerId });
  if (user.length === 0)
    throw new HttpError(
      "Cannot find account associated with the corresponding token",
      400,
    );

  if (!req.body.username) throw new HttpError("New username not provided", 400);

  const newUsername = (req.body.username as String).trim();
  if (req.body.username === "")
    throw new HttpError("New username not provided", 400);
  if (newUsername.length < 3) throw new HttpError("Username too small", 400);
  if (newUsername.length > 16) throw new HttpError("Username too long", 413);

  try {
    await Accounts.findOneAndUpdate(
      { _id: tokenDecoded.ownerId },
      { username: newUsername },
      { new: true },
    );
  } catch (err: any) {
    if (err.code === 11000) throw new HttpError("Username exists", 409);
    else throw new HttpError(String(err));
  }
  res.status(200).json({ status: "ok" });
});

/* GET /api/user/:user/posts */
const getUserPosts = errorHandler(async (req: Request, res: Response) => {
  const user = req.params.user;

  const userDoc = await Accounts.exists({ username: user });
  if (!userDoc) throw new HttpError("user not found", 404);

  const netPosts = (await Posts.find({ posterId: userDoc._id }).populate(
    "posterId",
  )) as PopulatedPostDoc[];

  res.status(200).json({
    status: "ok",
    data: (req.query.flattened === "true" ? true : false)
      ? netPosts.map((el) => ({
          _id: el._id,
          poster: el.posterId.username,
          guild: el.guild,
          title: el.title,
          content: el.content,
          likes: el.likedBy.length,
        }))
      : beautifyPosts(netPosts),
  });
});

/* GET /api/user/:user/guilds */
const getUserGuilds = errorHandler(async (req: Request, res: Response) => {
  const user = req.params.user;

  const userDoc = await Accounts.exists({ username: user });
  if (!userDoc) throw new HttpError("user not found", 404);

  const userGuildsDocs: GuildDoc[] = await Guilds.find({ owner: userDoc._id });

  res
    .status(200)
    .json({ status: "ok", data: userGuildsDocs.map((el) => el.name) });
});

const beautifyPosts = (
  netPosts: PopulatedPostDoc[],
): { [key: string]: TPost[] } => {
  let posts: { [key: string]: TPost[] } = {};

  for (let post of netPosts) {
    const guild = post.guild;
    const postWithoutGuild: TPost = {
      _id: post._id,
      poster: post.posterId.username,
      title: post.title,
      content: post.content,
      likes: (post.likedBy ?? []).length,
    };

    if (guild in posts) posts[guild].push(postWithoutGuild);
    else posts[guild] = [postWithoutGuild];
  }

  return posts;
};
export default {
  getUsername,
  getGuilds,
  getPosts,
  getUserPosts,
  getUserGuilds,
  patchUsername,
};
