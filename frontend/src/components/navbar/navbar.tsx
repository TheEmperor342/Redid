import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import API from "@src/apiPath";
import { useContext, useState } from "react";
import { TokenContext } from "@src/TokenContext";
import { IErrorsState } from "@types";
import { GiHamburgerMenu } from "react-icons/gi";

export default ({
	newError,
}: {
	newError: (payload: IErrorsState) => void;
}) => {
	const { token, setToken } = useContext(TokenContext);
	const [hamburgerActive, setHamburgerActive] = useState<boolean>(false);

	const navigate = useNavigate();
	const handleLogout = () => {
		logout(token!);
	};

	const logout = async (token: string) => {
		try {
			const res = await fetch(`${API}/api/auth/logout`, {
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
				});

				return;
			}
			setToken(null);
			navigate("/");
		} catch (err: any) {
			console.error(err);
			newError({
				id: self.crypto.randomUUID(),
				title: "Couldn't log you out",
				error: "Please try again later.",
			});
		}
	};

	const handleHamburger = () =>
		setHamburgerActive(!hamburgerActive);

	return (
		<nav>
			<h3>Reddit Clone</h3>
			<div className="largeScreenNavbar">
				<Link to="/">
					<p>Home</p>
				</Link>
				{token ? (
					<>
						<Link to="/post">
							<p>Post</p>
						</Link>
						<Link to="/settings">
							<p>Settings</p>
						</Link>
						<p> Logged In </p>
						<button className="primary-btn" onClick={handleLogout}>Logout</button>
					</>
				) : (
					<>
						<Link to="/sign-in">
							<p>Sign In</p>
						</Link>
						<Link to="/sign-up">
							<p> Sign Up</p>
						</Link>
					</>
				)}
			</div>
			<div className="smallScreenNavbar">
				<button className="hamburger primary-btn" onClick={handleHamburger}><GiHamburgerMenu /></button>

			</div>
			<div className={`hamburgerMenu ${hamburgerActive ? "" : "display-none"}`} >
				<Link to="/">
					<p>Home</p>
				</Link>
				{token ? (
					<>
						<Link to="/post">
							<p>Post</p>
						</Link>
						<Link to="/settings">
							<p>Settings</p>
						</Link>
						<p> Logged In </p>
						<button className="primary-btn" onClick={handleLogout}>Logout</button>
					</>
				) : (
					<>
						<Link to="/sign-in">
							<p>Sign In</p>
						</Link>
						<Link to="/sign-up">
							<p> Sign Up</p>
						</Link>
					</>
				)}
			</div>
		</nav>
	);
};
