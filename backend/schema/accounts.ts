import mongoose, { CallbackError } from "mongoose";
import bcrypt from "bcrypt";

const accountsSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		select: false,
		required: true,
	},
});

accountsSchema.pre("save", async function (next) {
	try {
		const hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;
		next();
	} catch (err) {
		next(err as CallbackError);
	}
});

const Accounts = mongoose.model("account", accountsSchema);
export default Accounts;
