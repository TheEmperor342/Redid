import "./style.css";
import { Link } from "react-router-dom";
import { Token } from "../../types";

export default ({ token }: { token: Token }) => {
	return (
		<nav>
			<h3>Reddit Clone</h3>
			<div>
				<Link to="/"><p>Home</p></Link>
				{token ?
					<p> Logged In </p> :
					<>
						<Link to="/sign-in">
							<p>Sign In</p>
						</Link>
						<Link to="/sign-up">
						<p> Sign Up</p>
						</Link>
					</>
				}
			</div>
		</nav>
	)
}
