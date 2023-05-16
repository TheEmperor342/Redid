import React from "react"

export type Token = string | null;
export type setStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export interface signUpProps {
	token: Token;
	setToken: setStateFunction<Token>;
};

export interface ErrorsState {
	id: string;
	title: string;
	error: string;
};
export type Action = {
	type: string,
	payload: ErrorsState,
};

export type ErrorsReducer = React.Reducer<ErrorsState[], Action>;


