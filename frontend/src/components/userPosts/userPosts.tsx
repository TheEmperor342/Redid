import React from "react";
import Card from "../card/card";
import { userPostsProps } from "../../types";
import "./index.css";

const userPosts: React.FC<userPostsProps> = ({ posts, username, postsDispatch, newError }) => (
  <div className="organisedPostsContainer">
    <div className="organisedPostsSidebar">
      <h4>Guilds you have posted in</h4>
      {Object.keys(posts).map((guild) => (
        <React.Fragment key={self.crypto.randomUUID()}>
          <a href={"#" + guild}>{guild}</a>
          <br />
        </React.Fragment>
      ))}
    </div>
    <div className="organisedPosts">
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

export default userPosts;
