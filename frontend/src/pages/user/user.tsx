import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GenericPageProps } from "@types";
import OrganisedPostsView from "@components/organisedPostsView";
import useOrganisedPostsReducer from "@hooks/useOrganisedPostReducer";
import API from "@src/apiPath";
import Loading from "@components/loading/loading";

const User: React.FC<GenericPageProps> = ({ newError }) => {
  const { username } = useParams();

  const [posts, postsDispatch] = useOrganisedPostsReducer({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userExists, setUserExists] = useState<boolean>(true);

  useEffect(() => {
    getUserPosts().then((json) =>
      postsDispatch({ type: "populate", payload: json }),
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
    <Loading />
  );
};

export default User;
