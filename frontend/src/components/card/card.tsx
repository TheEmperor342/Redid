import react from "react";
import "./style.css";

interface ICardProps {
	title: string;
	content: string;
	user: string;
	guild: string;
}

const Card: react.FC<ICardProps>  = ({title, content, user, guild}) => {
	return (
	<div className="card">
		<p className="cardTopInfo">{user} - {guild}</p>
		<h2>{title}</h2>
		<p>{content}</p>
	</div>);
}

export default Card;
