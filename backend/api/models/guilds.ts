import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: true,
  },
  name: { type: String, required: true, unique: true },
});

const Guilds = mongoose.model("guild", guildSchema);
export default Guilds;
