import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import "./index.css";
import { postProps } from "../../types";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import API from "../../apiPath";
import { TokenContext } from "../../TokenContext";

const post: React.FC<postProps> = ({ newError }) => {
  const location = useLocation();
  const { token } = useContext(TokenContext);
  if (token === null)
    return <Navigate to="/sign-in" state={{ from: location }} replace />;

  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [textArea, setTextArea] = useState<string>("");
  const [guild, setGuild] = useState<string>("");

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setTextArea(e.target.value);

  const handleGuildChange = (e: ChangeEvent<HTMLInputElement>) =>
    setGuild(e.target.value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(token, title, textArea, guild);
  };

  const submit = async (
    token: string,
    title: string,
    textArea: string,
    guild: string
  ) => {
    if (
      !token ||
      !title ||
      !textArea ||
      !guild ||
      token.trim() === "" ||
      title.trim() === "" ||
      textArea.trim() == "" ||
      guild.trim() === ""
    ) {
      newError({
        id: self.crypto.randomUUID(),
        title: "Error",
        error: "Please fill all the fields",
      });
      return;
    }
    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content: textArea,
          guild,
        }),
      });
      const json = await res.json();
      console.log(json);
      if (!res.ok) {
        if (res.status === 404)
          newError({
            id: self.crypto.randomUUID(),
            title: "Error",
            error: "Guild doesn't exist",
          });
        switch (json.message) {
          case "content too long":
            newError({
              id: self.crypto.randomUUID(),
              title: "Error",
              error: "Content too long",
            });
            break;
          case "title, content or guild not provided":
            newError({
              id: self.crypto.randomUUID(),
              title: "Error",
              error: "Please fill all the fields",
            });
            break;
          case "title too long":
            newError({
              id: self.crypto.randomUUID(),
              title: "Error",
              error: "Title too long",
            });
            break;
          default:
            newError({
              id: self.crypto.randomUUID(),
              title: "Unknown error occured",
              error: `${res.status}: ${res.statusText}`,
            });
            break;
        }
        return;
      }
      navigate("/");
    } catch (err) {
      newError({
        id: self.crypto.randomUUID(),
        title: "Unknown error occured",
        error: String(err),
      });
    }
  };

  return (
    <div className="postContainer">
      <h3>Create a post</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <br />
          <input type="text" value={title} onChange={handleTitleChange} />
        </label>
        <br />
        <label>
          Guild:
          <br />
          <input
            className="whichGuild"
            type="text"
            value={guild}
            onChange={handleGuildChange}
          />
        </label>
        <br />
        <label>
          Content:
          <br />
          <textarea
            className="inputPostContent"
            value={textArea}
            onChange={handleTextAreaChange}
          />
        </label>
        <br />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default post;
