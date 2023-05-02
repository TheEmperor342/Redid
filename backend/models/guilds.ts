import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "accounts",
	},
	name: { type: String, unique: true },
});

const Guilds = mongoose.model("guild", guildSchema);
export default Guilds;
