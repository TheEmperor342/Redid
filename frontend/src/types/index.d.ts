import React from "react";

export interface TokenContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

export interface homeProps {
  newError: (payload: IErrorsState) => void;
}

export interface postProps {
  newError: (payload: IErrorsState) => void;
}

export interface settingsProps {
  newError: (payload: IErrorsState) => void;
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
  payload: IErrorsState;
};

export type ErrorsReducer = React.Reducer<IErrorsState[], ErrorsAction>;
export type PostsReducer = React.Reducer<IPosts[], PostsAction>;
