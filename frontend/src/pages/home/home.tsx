import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import Card from "../../components/card/card";
import API from "../../apiPath";
import "./index.css";
import { homeProps, PostsReducer, IPost, PostsAction } from "../../types";
import { TokenContext } from "../../TokenContext";

const reducer = (state: IPost[], action: PostsAction): IPost[] => {
  switch (action.type) {
    case "populate":
      return action.payload;
    case "updatePost":
      return state.map((el) =>
        !(el._id === action.payload[0]._id) ? el : action.payload[0]
      );
    default:
      return state;
  }
};

export default ({ newError }: homeProps) => {
  const [data, dataDispatch] = useReducer<PostsReducer>(reducer, []);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const { token } = useContext(TokenContext);

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

  const updatePost = useCallback((payload: IPost) => {
    dataDispatch({ type: "updatePost", payload: [payload] });
  }, []);

  return (
    <div className="content">
      {isLoading && <h1>Loading</h1>}
      {error && <h1>Error</h1>}
      {data.map((el) => (
        <Card
          key={el._id}
          data={el}
          updatePost={updatePost}
          settings={false}
        />
      ))}
    </div>
  );
};
