import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
	posterId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "account",
	},
	guildId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "guilds",
	},
	guild: {
		type: String,
		required: true,
	},
	title: { type: String, required: true },
	content: { type: String, required: true },
	likedBy: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "account",
			},
		],
		default: [],
	},
});

const Posts = mongoose.model("post", postSchema);
export default Posts;
