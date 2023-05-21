import React, { useCallback, useContext, useEffect, useState } from "react";
import "./style.css";
import { CardPropsHome, CardPropsSettings } from "../../types";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import API from "../../apiPath";
import { TokenContext } from "../../TokenContext";

const Card: React.FC<CardPropsHome | CardPropsSettings> = ({ data, updatePost, settings }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  /*
   * If this component is initialized from `/settings`, then there is
   * no need to get the token because no data manipulation will be
   * done. 
   *
   * In the route `/settings`, this component is purely for display.
   * */
  const {token} = settings ? {token: null} : useContext(TokenContext);

  useEffect(() => {
    if (token !== null) isLikedByMe(data._id, token);
  }, []);

  const isLikedByMe = useCallback(async (id: string, token: string) => {
    console.log(`Ran: ${id}`);
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

  const likeOrUnlike = async () => {
    const path = `${API}/api/posts/${data._id}/${isLiked ? "unlike" : "like"}`;

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
      return;
    }
    setIsLiked(!isLiked);

    updatePost({
      _id: data._id,
      poster: data.poster,
      guild: data.guild,
      title: data.title,
      content: data.content,
      likes: json.likes,
    });
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
            <button onClick={() => likeOrUnlike()}>
              {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
            <BsDot />
            <p>{isError ? "Couldn't fetch data" : data.likes}</p>
          </>
        ) : (
          <p>
            <AiOutlineHeart />
            <BsDot />
            {data.likes}
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
