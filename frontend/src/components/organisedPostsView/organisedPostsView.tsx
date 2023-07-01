import React from "react";
import Card from "@components/card/card";
import { OrganisedPostsViewProps } from "@types";
import "./style.css";

const organisedPostsView: React.FC<OrganisedPostsViewProps> = ({
  posts,
  postsDispatch,
  newError,
  topText,
  sidebarText,
}) => (
  <div className="PostsViewContainer">
    <div className="PostsViewSidebar">
      <h4>{sidebarText}</h4>
      {Object.keys(posts).map((guild) => (
        <React.Fragment key={self.crypto.randomUUID()}>
          <a href={"#" + guild}>{guild}</a>
          <br />
        </React.Fragment>
      ))}
    </div>
    <div className="PostsViewMain">
      <h1>{topText}</h1>
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

export default organisedPostsView;
