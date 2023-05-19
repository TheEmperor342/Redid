import { Request, Response } from "express";
import { HttpError, errorHandler } from "../utils";
import { jwtPayloadOverride } from "../types";
import { Posts, Guilds } from "../models";

const post = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  if (!req.body.title || !req.body.content || !req.body.guild)
    throw new HttpError("title, content or guild not provided", 400);

  const title = (req.body.title as String).trim();
  const content = (req.body.content as String).trim();
  const guild = (req.body.guild as String).trim();

  if (title === "" || content === "" || guild === "")
    throw new HttpError("title, content or guild not provided", 400);

  if (title.length > 30) throw new HttpError("title too long", 400);

  if (content.length > 1000) throw new HttpError("content too long", 400);

  const guildExists = await Guilds.exists({ name: guild });
  if (!guildExists) throw new HttpError("guild does not exist", 404);

  const postDoc = new Posts({
    posterId: tokenDecoded.ownerId,
    guildId: guildExists._id,
    poster: tokenDecoded.username,
    guild,
    title,
    content,
    likedBy: [],
  });

  await postDoc.save();

  res.status(201).json({ status: "ok" });
});

// ================== //

const deletePost = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const postId = req.params.postId;

  const post = await Posts.findOne({ _id: postId });
  if (post === null) throw new HttpError("post not found", 404);

  if (post.posterId.toString() !== tokenDecoded.ownerId)
    throw new HttpError("user is not the owner of the post", 403);

  await Posts.deleteMany({ _id: post._id });
  res.status(200).json({ status: "ok" });
});

// ================== //

const get = errorHandler(async (req: Request, res: Response) => {
  const number = Number(req.query.number ?? 5);
  if (isNaN(number))
    throw new HttpError("Please provide an appropriate number", 400);
  if (number < 1 || number > 15)
    throw new HttpError("number cannot be < 1 or > 15", 400);

  const posts = await Posts.find().sort({ _id: -1 }).limit(number);

  res.status(200).json({
    status: "ok",
    data: posts.map((el) => {
      return {
        _id: el._id,
        poster: el.poster,
        guild: el.guild,
        title: el.title,
        content: el.content,
        likes: el.likedBy.length,
      };
    }),
  });
});

// ================== //

// POST /api/posts/:id/like/
// Authorization: Bearer <token>
const likePost = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const postExists = await Posts.exists({ _id: req.params.id });

  if (postExists === null) throw new HttpError("Post not found", 404);

  const updatedLikeDoc = await Posts.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { likedBy: tokenDecoded.ownerId } },
    { new: true, upsert: true }
  );

  res.status(200).json({ status: "ok", likes: updatedLikeDoc.likedBy.length });
});

// POST /api/posts/:id/like/
// Authorization: Bearer <token>
const unlikePost = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const postExists = await Posts.exists({ _id: req.params.id });

  if (postExists === null) throw new HttpError("Post not found", 404);

  const updatedLikeDoc = await Posts.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { likedBy: tokenDecoded.ownerId } },
    { new: true }
  );

  res.status(200).json({ status: "ok", likes: updatedLikeDoc!.likedBy.length});
});

// GET /api/posts/:id/isLikedByMe
// Authorization: Bearer <token>
const isLikedByMe = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;
  const postExists = await Posts.exists({ _id: req.params.id });

  if (postExists === null) throw new HttpError("Post not found", 404);

  const user = await Posts.exists({
    _id: req.params.id,
    likedBy: { $in: [tokenDecoded.ownerId] },
  });

  res.status(200).json({ status: "ok", hasLiked: !user ? false : true });
});

export default {
  get,
  post,
  delete: deletePost,
  likePost,
  unlikePost,
  isLikedByMe
};
