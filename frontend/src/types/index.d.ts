import React from "react"

export type Token = string | null;
export type setStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export interface signUpProps {
	token: Token;
	setToken: setStateFunction<Token>;
};
