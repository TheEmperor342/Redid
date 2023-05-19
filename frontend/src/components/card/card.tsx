import react, { useCallback, useEffect, useState } from "react";
import "./style.css";
import { ICardProps } from "../../types";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import API from "../../apiPath";

const Card: react.FC<ICardProps> = ({ token, data, updatePost }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    isLikedByMe(data._id, token);
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

  const likeOrUnlike = async () => {
    console.log(data.title, isLiked);
    const path = `${API}/api/posts/${data._id}/${isLiked ? "unlike" : "like"}`;

    const res = await fetch(path, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const json = await res.json();
      console.log(res, json);
      return;
    }
    const json = await res.json();
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
