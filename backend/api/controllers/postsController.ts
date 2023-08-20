import { Request, Response } from "express";
import { HttpError, errorHandler } from "../utils";
import { PopulatedPostDoc, jwtPayloadOverride } from "../types";
import { Posts, Guilds } from "../models";
import mongoose from "mongoose";

const MAX_TITLE_LENGTH = 30;
const MAX_CONTENT_LENGTH = 1000;

/* POST api/posts
 * Authorization: Bearer <token>
 * Content-Type: application/json
 *
 * {
 *   "title": string,
 *   "content": string,
 *   "guild": string
 * }
 */
const post = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  if (!req.body.title || !req.body.content || !req.body.guild)
    throw new HttpError("title, content or guild not provided", 400);

  const title = (req.body.title as String).trim();
  const content = (req.body.content as String).trim();
  const guild = (req.body.guild as String).trim();

  if (title === "" || content === "" || guild === "")
    throw new HttpError("title, content or guild not provided", 400);

  if (title.length > MAX_TITLE_LENGTH)
    throw new HttpError("title too long", 413);

  if (content.length > MAX_CONTENT_LENGTH)
    throw new HttpError("content too long", 413);

  const guildExists = await Guilds.exists({ name: guild });
  if (!guildExists) throw new HttpError("guild does not exist", 404);

  const postDoc = new Posts({
    posterId: tokenDecoded.ownerId,
    guildId: guildExists._id,
    guild,
    title,
    content,
    likedBy: [],
  });

  await postDoc.save();

  res.status(201).json({ status: "ok" });
});

// ================== //

/* DELETE /api/posts/:postId
 * Authorization: Bearer <token>
 */
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

/* GET /api/posts/ */
const get = errorHandler(async (req: Request, res: Response) => {
  const number = Number(req.query.number ?? 5);
  if (isNaN(number))
    throw new HttpError("Please provide an appropriate number", 400);
  if (number < 1 || number > 15)
    throw new HttpError("number cannot be < 1 or > 15", 400);

  const posts: PopulatedPostDoc[] = await Posts.find()
    .sort({ _id: -1 })
    .limit(number)
    .populate("posterId");

  res.status(200).json({
    status: "ok",
    data: posts.map((el) => {
      return {
        _id: el._id,
        poster: el.posterId.username,
        guild: el.guild,
        title: el.title,
        content: el.content,
        likes: el.likedBy.length,
      };
    }),
  });
});

// ================== //

/* POST /api/posts/:id/like/
 * Authorization: Bearer <token>
 */
const likePost = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  try {
    const updatedLikeDoc = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { likedBy: tokenDecoded.ownerId } },
      { new: true },
    );
    if (updatedLikeDoc === null) throw new HttpError("Post not found", 404);

    res
      .status(200)
      .json({ status: "ok", likes: updatedLikeDoc.likedBy.length });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError)
      throw new HttpError("Invalid ID", 400);
    else throw new HttpError(String(err));
  }
});

/* POST /api/posts/:id/dislike/
 * Authorization: Bearer <token>
 */
const dislikePost = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;

  const postExists = await Posts.exists({ _id: req.params.id });

  if (postExists === null) throw new HttpError("Post not found", 404);

  try {
    const updatedLikeDoc = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { likedBy: tokenDecoded.ownerId } },
      { new: true },
    );
    if (updatedLikeDoc === null) throw new HttpError("Post not found", 404);

    res
      .status(200)
      .json({ status: "ok", likes: updatedLikeDoc.likedBy.length });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError)
      throw new HttpError("Invalid ID", 400);
    else throw new HttpError(String(err));
  }
});

/* GET /api/posts/:id/isLikedByMe
 * Authorization: Bearer <token>
 */
// TODO: Move this to GET /api/posts/
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

/* GET /api/posts/:id */
const getSpecificPostInfo = errorHandler(
  async (req: Request, res: Response) => {
    const post = (await Posts.findOne({ _id: req.params.id }).populate(
      "posterId",
    )) as PopulatedPostDoc;

    if (post === null) throw new HttpError("post not found", 404);

    res.status(200).json({
      status: "ok",
      data: {
        _id: post._id,
        poster: post.posterId.username,
        guild: post.guild,
        title: post.title,
        content: post.content,
        likes: post.likedBy.length,
      },
    });
  },
);

/* PATCH /api/posts/:id
 * Authorization: Bearer <token>
 * Content-Type: application/json
 *
 * {
 *   title?: string,
 *   content?: string
 * }
 */
const patch = errorHandler(async (req: Request, res: Response) => {
  const tokenDecoded: jwtPayloadOverride = res.locals.tokenDecoded;
  const postExists = await Posts.exists({
    _id: req.params.id,
    posterId: tokenDecoded.ownerId,
  });

  if (postExists === null)
    throw new HttpError(
      "Either post doesn't exist, or you aren't the owner of the post",
      404,
    );

  const data: { [key: string]: string | undefined } = {
    title: req.body.title,
    content: req.body.content,
  };
  const isBodyEmpty = Object.keys(data).every((key) => data[key] === undefined);

  if (isBodyEmpty) throw new HttpError("no content provided", 400);

  const filteredData: { [key: string]: string } = {};

  Object.keys(data).forEach((field) => {
    const fieldData = data[field];
    if (fieldData !== undefined) {
      const isTitleOrContentTooLarge =
        (field === "title" && String(fieldData).length > MAX_TITLE_LENGTH) ||
        (field === "content" && String(fieldData).length > MAX_CONTENT_LENGTH);

      if (isTitleOrContentTooLarge)
        throw new HttpError("title or content too large", 413);
      filteredData[field] = String(fieldData);
    }
  });

  await Posts.findOneAndUpdate({ _id: req.params.id }, { $set: filteredData });
  res.status(200).json({ status: "ok" });
});

export default {
  get,
  post,
  delete: deletePost,
  patch,
  likePost,
  dislikePost,
  isLikedByMe,
  getSpecificPostInfo,
};
