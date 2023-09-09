import usePostsReducer from "@src/hooks/usePostsReducer";
import { GenericPageProps } from "@types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@components/card";
import API from "@src/apiPath";
import Loading from "@components/loading/loading";

const Guild: React.FC<GenericPageProps> = ({ newError }) => {
  const { guild } = useParams();
  const [posts, postsDispatch] = usePostsReducer([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [guildExists, setGuildExists] = useState<boolean>(true);

  useEffect(() => {
    getGuildPosts().then((json) =>
      postsDispatch({ type: "populate", payload: json }),
    );
  }, []);

  const getGuildPosts = async () => {
    const res = await fetch(`${API}/api/guilds/${guild}/posts`);
    const json = await res.json();

    if (!res.ok) {
      setGuildExists(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    return json.data;
  };

  return !isLoading ? (
    guildExists ? (
      <div>
        <h1>{guild}</h1>
        {posts.map((post) => (
          <Card
            key={self.crypto.randomUUID()}
            data={post}
            newError={newError}
            deletePost={(payload: string) => {
              postsDispatch({ type: "delete", payload });
            }}
          />
        ))}
      </div>
    ) : (
      <Loading />
    )
  ) : (
    <Loading />
  );
};

export default Guild;
