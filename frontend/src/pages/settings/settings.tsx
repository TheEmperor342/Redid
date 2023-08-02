import React, { useContext } from "react";
import { GenericPageProps } from "@types";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { TokenContext } from "@src/TokenContext";
import API from "@src/apiPath";
import { AiOutlineLink, AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import CreateGuild from "@components/newGuild";
import "./index.css";

const Settings: React.FC<GenericPageProps> = ({ newError }) => {
	const location = useLocation();

	const { token, setToken } = useContext(TokenContext);
	if (token === null)
		return <Navigate to="/sign-in" state={{ from: location }} replace />;

	const navigate = useNavigate();

	const tokenDecoded = JSON.parse(atob(token.split(".")[1]));
	const username = tokenDecoded.username;

	if (username.trim() === "" || !username) {
		newError({
			id: self.crypto.randomUUID(),
			title: "Invalid token",
			error: "Your token seems to be manipulated. Please logout and relogin.",
		});
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	const handleDelete = async () => {
		const res = await fetch(`${API}/api/auth/delete-user`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const json = await res.json();
		if (!res.ok)
			newError({
				id: self.crypto.randomUUID(),
				title: "Couldn't delete account",
				error: `${res.status}: ${res.statusText}\n${JSON.stringify(json)}`
			})
		setToken(null);
		navigate("/");
	}
	return (
		<div className="settingsWrapper">
			<h1>{username}</h1>
			<div className="settingsWrapper__grid">
				<div>
					<p>View your posts</p>
					<Link to={`/u/${username}`}>
						<button className="primary-btn"><AiOutlineLink /></button>
					</Link>
				</div>
				<div>
					Delete Account
					<button className="primary-btn" onClick={handleDelete}><AiFillDelete /></button>
				</div>
				<div className="settingsWrapper__grid__createGuild">
					<CreateGuild newError={newError}/>
				</div>
			</div>
		</div>
	);
};

export default Settings;
