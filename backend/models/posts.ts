import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
	poster: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "accounts",
	},
	guild: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "guilds",
	},
	title: { type: String, required: true },
	content: { type: String },
});

const Posts = mongoose.model("post", postSchema);
export default Posts;
