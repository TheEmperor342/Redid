import { Request, Response } from "express";
import { HttpError, errorHandler } from "../utils";
import { Guilds, Posts, Accounts } from "../models";
import { jwtPayloadOverride, TPost, PostDoc, GuildDoc } from "../types";

/* /api/user/guilds */
// This is to get guilds of the current user
const getGuilds = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const guilds = await Guilds.find({ owner: tokenDecoded.ownerId });

  res.status(200).json({ status: "ok", data: guilds.map((el) => el.name) });
});

/* /api/user/posts */
// This is to get posts of the current user
const getPosts = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const netPosts: PostDoc[] = await Posts.find({
    posterId: tokenDecoded.ownerId,
  });
  const posts = beautifyPosts(netPosts);

  res.status(200).json({ status: "ok", data: posts });
});

/* /api/user/:user/posts */
const getUserPosts = errorHandler(async (req: Request, res: Response) => {
  const user = req.params.user;

  const userDoc = await Accounts.exists({ username: user });
  if (!userDoc) throw new HttpError("user not found", 404);

  const userPostsDocs: PostDoc[] = await Posts.find({ posterId: userDoc._id });

  const posts = beautifyPosts(userPostsDocs);

  res.status(200).json({ status: "ok", data: posts });
});

/* /api/user/:user/guilds */
const getUserGuilds = errorHandler(async (req: Request, res: Response) => {
  const user = req.params.user;

  const userDoc = await Accounts.exists({ username: user });
  if (!userDoc) throw new HttpError("user not found", 404);

  const userGuildsDocs: GuildDoc[] = await Guilds.find({ owner: userDoc._id });

  res
    .status(200)
    .json({ status: "ok", data: userGuildsDocs.map((el) => el.name) });
});

const beautifyPosts = (netPosts: PostDoc[]): { [key: string]: TPost[] } => {
  let posts: { [key: string]: TPost[] } = {};

  for (let post of netPosts) {
    const guild = post.guild;
    const postWithoutGuild: TPost = {
      _id: post._id,
      poster: post.poster,
      title: post.title,
      content: post.content,
      likes: (post.likedBy ?? []).length,
    };

    if (guild in posts) posts[guild].push(postWithoutGuild);
    else posts[guild] = [postWithoutGuild];
  }

  return posts;
};
export default { getGuilds, getPosts, getUserPosts, getUserGuilds };
