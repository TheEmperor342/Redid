import { useEffect, useState } from "react";
import Card from "@components/card/card";
import Loading from "@components/loading/loading";
import ErrorPage from "@components/errorPage/errorPage";
import API from "@src/apiPath";
import { GenericPageProps } from "@types";
import "./style.css";
import usePostsReducer from "@hooks/usePostsReducer";

export default ({ newError }: GenericPageProps) => {
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
    <>
      {isLoading && <Loading/>}
      {error && <ErrorPage/>}
      {
        !error && !isLoading &&<div className="home">
          {data.map((el) => (
            <Card
              key={el._id}
              data={el}
              deletePost={deletePost}
              newError={newError}
            />))}
        </div>
      }
    </>
  );
};
