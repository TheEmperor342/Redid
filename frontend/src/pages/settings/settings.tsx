import React, { useContext, useEffect, useState } from "react";
import { settingsProps, IPost } from "../../types";
import { Navigate, useLocation } from "react-router-dom";
import { TokenContext } from "../../TokenContext";
import API from "../../apiPath";
import Card from "../../components/card/card";

const Settings: React.FC<settingsProps> = ({ newError }) => {
  const location = useLocation();

  const { token } = useContext(TokenContext);
  if (token === null)
    return <Navigate to="/sign-in" state={{ from: location }} replace />;

  const [posts, setPosts] = useState<{ [key: string]: IPost[] }>({});
  const tokenDecoded = JSON.parse(atob(token.split(".")[1]));
  const username = tokenDecoded.username;

  useEffect(() => {
    getMyPosts().then((json) => setPosts(json));
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
      console.log(json);
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
      <h1>{username}</h1>
      {Object.keys(posts).map((guild) => (
        <div className="guildPosts" key={self.crypto.randomUUID()}>
          <h3>{guild}</h3>
          {posts[guild].map((post) => (
            <Card
              key={post._id}
              data={{ ...post, guild }}
              updatePost={() => {}}
              settings={true}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Settings;
