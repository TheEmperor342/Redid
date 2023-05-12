import react from "react";
import "./style.css";

interface ICardProps {
	title: string;
	content: string;
	poster: string;
	guild: string;
}

const Card: react.FC<ICardProps> = ({ title, content, poster, guild }) => {
	return (
		<div className="card">
			<div className="cardUpDownButtons">
				<button>^</button>
				<button>v</button>
			</div>
			<div className="cardTextContainer">
				<p className="cardTopInfo">{poster} - {guild}</p>
				<h2>{title}</h2>
				<p className="cardContent">{content}</p>
			</div>
		</div>);
}

export default Card;
