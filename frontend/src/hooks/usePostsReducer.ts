import React, { useReducer } from "react";
import { IPost, PostsAction, PostsReducer } from "@types";

const reducer = (state: IPost[], action: PostsAction): IPost[] => {
  switch (action.type) {
    case "populate":
      return action.payload;
    case "delete":
      return state.filter((el) => el._id !== action.payload);
    default:
      return state;
  }
};
const usePostsReducer = (
  initialState: IPost[],
): [IPost[], React.Dispatch<PostsAction>] =>
  useReducer<PostsReducer>(reducer, initialState);

export default usePostsReducer;
