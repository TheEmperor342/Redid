import React, { useContext, useEffect } from "react";
import { settingsProps } from "../../types";
import { Navigate, useLocation } from "react-router-dom";
import { TokenContext } from "../../TokenContext";
import API from "../../apiPath";
import Card from "../../components/card/card";
import useOrganisedPostsReducer from "../../hooks/useOrganisedPostReducer";
import "./index.css";

const Settings: React.FC<settingsProps> = ({ newError }) => {
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
    <div className="settings">
      <div className="settingsSidebar">
        <h4>Guilds you have posted in</h4>
        {Object.keys(posts).map((guild) => (
          <React.Fragment key={self.crypto.randomUUID()}>
            <a href={"#" + guild}>{guild}</a>
            <br />
          </React.Fragment>
        ))}
      </div>
      <div className="settingsPosts">
        <h1>{username}</h1>
        {Object.keys(posts).map((guild) => (
          <div className="guildPosts" key={self.crypto.randomUUID()} id={guild}>
            <h3>{guild}</h3>
            {posts[guild].map((post) => (
              <Card
                key={post._id}
                data={{ ...post, guild }}
                deletePost={(payload: string) => {
                  postsDispatch({
                    type: "delete",
                    payload,
                  });
                }}
                newError={newError}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
