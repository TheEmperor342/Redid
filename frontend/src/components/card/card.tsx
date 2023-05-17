import react from "react";
import "./style.css";
import { ICardProps } from "../../types";

const Card: react.FC<ICardProps> = ({ id, token, title, content, poster, guild, likes }) => {
	return (
		<div className="card">
			<div className="cardTextContainer">
				<p className="cardTopInfo">{poster} - {guild}</p>
				<h2>{title}</h2>
				<p className="cardContent">{content}</p>
			</div>
			<div className="cardUpDownButtons">
				{token !== null ?
					<button>Likes -- {likes}</button> :
					<p>Likes -- {likes}</p>
				}
			</div>
		</div>);
}

export default Card;
