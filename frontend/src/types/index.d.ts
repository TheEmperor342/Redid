import React from "react"

export type setStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export interface signUpProps {
	token: string | null;
	setToken: setStateFunction<Token>;
};

export interface homeProps { 
	token: string | null;
	newError: (payload: ErrorsState) => void;
};

export interface IPost {
	_id: string;
	poster: string;
	guild: string;
	title: string;
	content: string;
	likes: number;
};

interface ICardProps {
	id: string;
	token: string;
	title: string;
	content: string;
	poster: string;
	guild: string;
	likes: number;
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
