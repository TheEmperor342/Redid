import jwt from "jsonwebtoken";

export const sign = (
	obj: { [key: string]: any },
	options: { expiry: string; key: string } = {
		expiry: "15m",
		key: process.env.JWT_KEY!,
	}
): string => jwt.sign(obj, options.key, { expiresIn: options.expiry });
