import mongoose from "mongoose";

const refreshTokensSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "accounts",
	},
});

const refreshTokens = mongoose.model("refreshToken", refreshTokensSchema);
export default refreshTokens;
