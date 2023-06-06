import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { GenericPageProps, TokenContent } from "@types";
import { TokenContext } from "@src/TokenContext";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { IPost } from "@types";
import API from "@src/apiPath";

const ModifyPost: React.FC<GenericPageProps> = ({ newError }) => {
  const { token } = useContext(TokenContext);
  const location = useLocation();

  if (token === null)
    return <Navigate to="/sign-in" state={{ from: location }} replace />;

  const { postId } = useParams();
  const [isError, setIsError] = useState<boolean>(false);
  const [dataState, setDataState] = useState<IPost[]>([]);
  const navigate = useNavigate();
  const [original, setOriginal] = useState<{[key: string]: string}>({});
  const tokenDecoded: TokenContent = JSON.parse(atob(token.split(".")[1]));

  useEffect(() => {
    getPost().then((post) => {
      if (tokenDecoded.username !== post.poster) {
        setIsError(true);
        newError({
          id: self.crypto.randomUUID(),
          title: "Error",
          error: "You are not the owner of the post",
        });
      }

      setOriginal({title: post.title, content: post.content});
      setDataState([post]);
    });
  }, []);

  const getPost = async () => {
    const res = await fetch(`${API}/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      newError({
        id: self.crypto.randomUUID(),
        title: "Error",
        error:
          res.status === 404
            ? "Post not found"
            : `${res.status}: ${json.message}`,
      });
      setIsError(true);
      return;
    }
    return json.data;
  };
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDataState([{ ...dataState[0], title: e.target.value }]);
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setDataState([{ ...dataState[0], content: e.target.value }]);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body: {[key: string]: string} = {};
    if (dataState[0].title !== original.title) body.title = dataState[0].title;
    if (dataState[0].content !== original.content) body.content = dataState[0].content;
    if (Object.keys(body).length === 0) {
      newError({
        id: self.crypto.randomUUID(),
        title: "Unmodified data",
        error: "You haven't modified the data"
      });
      return;
    }

    const res = await fetch(`${API}/api/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      newError({
        id: self.crypto.randomUUID(),
        title: "Unknown error occured",
        error: `${res.status}: ${res.statusText}`
      });
      return;
    }
    navigate("/settings");
  }

  return dataState.length !== 0 ? (
    <div className="modifyPostContainer">
      <h1>Edit post</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title: <br />
          <input
            type="text"
            value={dataState[0].title}
            onChange={handleTitleChange}
          />
        </label>
        <br />
        <label>
          Content: <br />
          <textarea
            className="inputPostContent"
            value={dataState[0].content}
            onChange={handleTextChange}
          />
        </label>
        <button type="submit">Update Post</button>
      </form>
    </div>
  ) : (
    <h1>Loading</h1>
  );
};

export default ModifyPost;
