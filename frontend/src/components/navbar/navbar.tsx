import "./style.css";
import { Link } from "react-router-dom";

export default () => {
	return (
		<nav>
			<h3>Reddit Clone</h3>
			<div>
				<Link to="/"><p>HOME</p></Link>
			</div>
		</nav>
	)
}
