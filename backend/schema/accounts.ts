import mongoose, { CallbackError } from "mongoose";
import bcrypt from "bcrypt";

const accountsSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

accountsSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(8);
		const hashedPassword = await bcrypt.hash(this.password, salt);
		this.password = hashedPassword;
		next();
	} catch (err) {
		next(err as CallbackError);
	}
});

const Account = mongoose.model("Account", accountsSchema);
export default Account;
