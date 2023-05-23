import { useEffect, useState } from "react";
import Card from "../../components/card/card";
import API from "../../apiPath";
import "./index.css";
import { homeProps } from "../../types";
import usePostsReducer from "../../hooks/usePostsReducer";

export default ({ newError }: homeProps) => {
  const [data, dataDispatch] = usePostsReducer([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
    fetch(`${API}/api/posts`, { mode: "cors" })
      .then((res) => {
        if (res.ok) return res.json();
        else throw res;
      })
      .then((json) => {
        dataDispatch({ type: "populate", payload: json.data });
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    newError({
      id: self.crypto.randomUUID(),
      title: "Couldn't load posts",
      error: "Couldn't fetch posts from the servers. Maybe try again.",
    });
  }, [error]);

  const deletePost = (payload: string) => {
    dataDispatch({ type: "delete", payload });
  };

  return (
    <div className="content">
      {isLoading && <h1>Loading</h1>}
      {error && <h1>Error</h1>}
      {data.map((el) => (
        <Card
          key={el._id}
          data={el}
          deletePost={deletePost}
          newError={newError}
        />
      ))}
    </div>
  );
};
