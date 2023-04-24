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
		const hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;
		next();
	} catch (err) {
		next(err as CallbackError);
	}
});

const Account = mongoose.model("Account", accountsSchema);
export default Account;
