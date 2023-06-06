import React from "react";

type newError = (payload: IErrorsState) => void;

export interface TokenContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

export interface TokenContent {
  username: string;
  ownerId: any;
  tokenId: any;
}

// ***************
export interface GenericPageProps {
  newError: newError;
}

export interface CardProps {
  data: IPost;
  deletePost: (payload: string) => void;
  newError: newError;
}

export interface OrganisedPostsViewProps {
  posts: OrganisedPosts;
  postsDispatch: React.Dispatch<OrganisedPostAction>;
  newError: newError;
  sidebarText: string;
  topText: stirng;
}

// ****************
export interface IPost {
  _id: string;
  poster: string;
  guild: string;
  title: string;
  content: string;
  likes: number;
}
export type PostsAction =
  | {
      type: "populate";
      payload: IPost[];
    }
  | {
      type: "delete";
      payload: string;
    };
export type PostsReducer = React.Reducer<IPost[], PostsAction>;

// ****************
export interface IErrorsState {
  id: string;
  title: string;
  error: string;
}
export interface ErrorsAction {
  type: string;
  payload: IErrorsState;
}
export type ErrorsReducer = React.Reducer<IErrorsState[], ErrorsAction>;

// For the reducer in `pages/settings/settings.tsx`
export type OrganisedPosts = { [key: string]: Omit<IPost, "guild">[] };
export type OrganisedPostAction =
  | {
      type: "populate";
      payload: OrganisedPosts;
    }
  | {
      type: "delete";
      payload: string;
    };
export type OrganisedPostsReducer = React.Reducer<
  OrganisedPosts,
  OrganisedPostsAction
>;
