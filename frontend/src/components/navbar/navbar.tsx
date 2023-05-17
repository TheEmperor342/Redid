import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import API from "../../apiPath";
import { ErrorsState, setStateFunction } from "../../types";

export default ({ token, newError, setToken }: { token: string | null, setToken: setStateFunction<string | null>, newError: (payload: ErrorsState) => void }) => {
	const navigate = useNavigate();
	const handleLogout = () => {
		signOut(token!);
	};

	const signOut = useCallback(async (token: string) => {
		try {
			const res = await fetch(`${API}/api/auth/sign-up`, {
				method: "DELETE",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.status === 404) {
				setToken(null);
				navigate("/");
				return;
			}
			if (!res.ok) {
				newError({
					id: self.crypto.randomUUID(),
					title: "Couldn't log you out",
					error: "Please try again later.",
				})

				return;
			}
			setToken(null);
			navigate("/");
		}
		catch (err: any) {
			console.error(err);
			newError({
				id: self.crypto.randomUUID(),
				title: "Couldn't log you out",
				error: "Please try again later.",
			})
		}
	}, []);

	return (
		<nav>
			<h3>Reddit Clone</h3>
			<div>
				<Link to="/"><p>Home</p></Link>
				{token ?
					<>
						<p> Logged In </p>
						<button onClick={handleLogout}>Logout</button>
					</> :
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
