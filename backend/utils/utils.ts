import jwt from "jsonwebtoken";

interface IObjectToSign {
	[key: string]: any;
}
export const sign = (obj: IObjectToSign, expiry: string = "30d"): string =>
	//@ts-ignore
	jwt.sign(obj, process.env.JWT_KEY, { expiresIn: expiry });
