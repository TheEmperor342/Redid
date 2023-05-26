import React, { useContext, useEffect } from "react";
import { GenericPageProps } from "@types";
import { Navigate, useLocation } from "react-router-dom";
import { TokenContext } from "@src/TokenContext";
import API from "@src/apiPath";
import useOrganisedPostsReducer from "@hooks/useOrganisedPostReducer";
import OrganisedPostsView from "@components/organisedPostsView";

const Settings: React.FC<GenericPageProps> = ({ newError }) => {
  const location = useLocation();

  const { token } = useContext(TokenContext);
  if (token === null)
    return <Navigate to="/sign-in" state={{ from: location }} replace />;

  const [posts, postsDispatch] = useOrganisedPostsReducer({});

  const tokenDecoded = JSON.parse(atob(token.split(".")[1]));
  const username = tokenDecoded.username;

  useEffect(() => {
    getMyPosts().then((json) => {
      postsDispatch({ type: "populate", payload: json });
    });
  }, []);

  const getMyPosts = async () => {
    const res = await fetch(`${API}/api/user/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();

    if (!res.ok) {
      newError({
        id: self.crypto.randomUUID(),
        title: "Error",
        error: "Couldn't fetch your posts",
      });
      return;
    }
    return json.data;
  };

  if (username.trim() === "" || !username) {
    newError({
      id: self.crypto.randomUUID(),
      title: "Invalid token",
      error: "Your token seems to be manipulated. Please logout and relogin.",
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return (
    <OrganisedPostsView
      posts={posts}
      topText={username}
      postsDispatch={postsDispatch}
      newError={newError}
      sidebarText="Guilds you have posted in"
    />
  );
};

export default Settings;
