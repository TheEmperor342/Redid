import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "accounts",
	},
});

const Tokens = mongoose.model("token", tokenSchema);
export default Tokens;
