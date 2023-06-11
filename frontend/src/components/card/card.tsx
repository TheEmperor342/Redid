import React, { useCallback, useContext, useEffect, useState } from "react";
import "./style.css";
import { CardProps } from "@types";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import API from "@src/apiPath";
import { TokenContext } from "@src/TokenContext";

const Card: React.FC<CardProps> = ({ data, deletePost, newError }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(data.likes);

  const { token } = useContext(TokenContext);
  const { username } =
    token === null ? { username: null } : JSON.parse(atob(token.split(".")[1]));

  useEffect(() => {
    if (token !== null) isLikedByMe(data._id, token);
  }, []);

  const isLikedByMe = useCallback(async (id: string, token: string) => {
    const res = await fetch(`${API}/api/posts/${id}/isLikedByMe`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      setIsError(true);
      return;
    }
    const json = await res.json();
    setIsLiked(json.hasLiked);
  }, []);

  const likeOrDislike = async () => {
    const path = `${API}/api/posts/${data._id}/${isLiked ? "dislike" : "like"}`;

    const res = await fetch(path, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      console.log(res, json);
      newError({
        id: self.crypto.randomUUID(),
        title: "Error",
        error: "Couldn't like post",
      });
      return;
    }
    setIsLiked(!isLiked);

    setLikes(json.likes);
  };

  const handleDelete = async () => {
    const res = await fetch(`${API}/api/posts/${data._id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      newError({
        id: self.crypto.randomUUID(),
        title: "Error",
        error: "Couldn't delete post",
      });
      return;
    }
    deletePost(data._id);
  };

  return (
    <div className="card">
      <div className="cardTextContainer">
        <p className="cardTopInfo">
          {data.poster} - {data.guild}
        </p>
        <h2>{data.title}</h2>
        <p className="cardContent">{data.content}</p>
      </div>
      <div className="cardUpDownButtons">
        {token !== null ? (
          <>
            <button onClick={likeOrDislike}>
              {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
            <BsDot />
          </>
        ) : (
          <p>
            <AiOutlineHeart />
            <BsDot />
          </p>
        )}
        <p>{isError ? "Couldn't fetch data" : likes}</p>
        {data.poster === username ? (
          <>
            <BsDot />
            <button onClick={handleDelete}>
              <MdDeleteForever />
            </button>
            <BsDot />
            <button>
            <a href={`/modifyPost/${data._id}`}>
              <MdModeEditOutline />
              </a>
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Card;
