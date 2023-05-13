import react from "react";
import "./style.css";

interface ICardProps {
	title: string;
	content: string;
	poster: string;
	guild: string;
	likes: number;
}

const Card: react.FC<ICardProps> = ({ title, content, poster, guild, likes }) => {
	return (
		<div className="card">
			<div className="cardTextContainer">
				<p className="cardTopInfo">{poster} - {guild}</p>
				<h2>{title}</h2>
				<p className="cardContent">{content}</p>
			</div>
			<div className="cardUpDownButtons">
				<button>Like -- {likes}</button>
			</div>
		</div>);
}

export default Card;
