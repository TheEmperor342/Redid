import React, { useReducer } from "react";
import { IPost, OrganisedPostAction, OrganisedPostsReducer } from "@types";

const reducer = (
  state: { [key: string]: Omit<IPost, "guild">[] },
  action: OrganisedPostAction
): { [key: string]: Omit<IPost, "guild">[] } => {
  switch (action.type) {
    case "populate":
      return action.payload;
    case "delete":
      const keys = Object.keys(state);
      const newState: { [key: string]: Omit<IPost, "guild">[] } = {};
      keys.forEach((guild) => {
        state[guild].forEach((post) => {
          if (post._id !== (action.payload as string)) {
            if (!(guild in newState)) newState[guild] = [post];
            else newState[guild].push(post);
          }
        });
      });
      return newState;
    default:
      return state;
  }
};
const useOrganisedPostsReducer = (initialState: {
  [key: string]: Omit<IPost, "guild">[];
}): [
  { [key: string]: Omit<IPost, "guild">[] },
  React.Dispatch<OrganisedPostAction>
] => useReducer<OrganisedPostsReducer>(reducer, initialState);

export default useOrganisedPostsReducer;
