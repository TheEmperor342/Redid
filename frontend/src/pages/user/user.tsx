import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { GenericPageProps } from "@types";
import OrganisedPostsView from "@components/organisedPostsView";
import useOrganisedPostsReducer from "@hooks/useOrganisedPostReducer";
import API from "@src/apiPath";
import { TokenContext } from "@src/TokenContext";

const User: React.FC<GenericPageProps> = ({ newError }) => {
  const { token } = useContext(TokenContext);
  const location = useLocation();
  let loggedInUsername = undefined;
  if (token !== null)
    loggedInUsername = JSON.parse(atob(token.split(".")[1])).username;

  const { username } = useParams();

  if (loggedInUsername === username)
    return <Navigate to="/settings" state={{ from: location }} replace />;

  const [posts, postsDispatch] = useOrganisedPostsReducer({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userExists, setUserExists] = useState<boolean>(true);

  useEffect(() => {
    getUserPosts().then((json) =>
      postsDispatch({ type: "populate", payload: json })
    );
  }, []);

  const getUserPosts = async () => {
    const res = await fetch(`${API}/api/user/${username}/posts`);
    const json = await res.json();

    if (!res.ok) {
      setUserExists(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    return json.data;
  };
  return !isLoading ? (
    userExists ? (
      <OrganisedPostsView
        posts={posts}
        postsDispatch={postsDispatch}
        newError={newError}
        topText={username}
        sidebarText={`Guilds ${username} has posted in`}
      />
    ) : (
      <h1> Not found </h1>
    )
  ) : (
    <h1>Loading</h1>
  );
};

export default User;
