import React from "react";

export type setStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export interface signUpProps {
  token: string | null;
  setToken: setStateFunction<Token>;
}

export interface homeProps {
  token: string | null;
  newError: (payload: ErrorsState) => void;
}

export interface IPost {
  _id: string;
  poster: string;
  guild: string;
  title: string;
  content: string;
  likes: number;
}
export type PostsAction = {
  type: string;
  payload: IPost[];
};

export interface ICardProps {
  token: string;
  data: IPost;
  updatePost: (payload: IPost) => void;
}

export interface IErrorsState {
  id: string;
  title: string;
  error: string;
}
export type ErrorsAction = {
  type: string;
  payload: ErrorsState;
};

export type ErrorsReducer = React.Reducer<IErrorsState[], ErrorsAction>;
export type PostsReducer = React.Reducer<IPosts[], PostsAction>;
