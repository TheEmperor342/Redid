import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
	poster: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "accounts",
	},
	title: { type: String, required: true },
	content: { type: String },
});

const Posts = mongoose.model("post", postSchema);
export default Posts;
