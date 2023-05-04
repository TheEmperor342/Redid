import { NextFunction, Request, Response } from "express";

export const errorHandler =
	(fn: (req: Request, res: Response) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await fn(req, res);
		} catch (err) {
			if (!(err instanceof HttpError)) next(new HttpError(String(err), 500));
			else next(err);
		}
	};

export class HttpError extends Error {
	code: number;

	constructor(message: string, code: number) {
		super(message);
		this.code = code;
	}
}
