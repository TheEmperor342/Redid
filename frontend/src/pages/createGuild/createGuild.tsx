import { TokenContext } from "@src/TokenContext";
import { GenericPageProps } from "@types";
import { ChangeEvent, FormEvent, useCallback, useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import API from "@src/apiPath";

const CreateGuild: React.FC<GenericPageProps> = ({ newError }) => {
	const location = useLocation();
	const { token } = useContext(TokenContext);
	if (token === null)
		return <Navigate to="/sign-in" state={{ from: location }} replace />;

	const [guildName, setGuildName] = useState("");
	const navigate = useNavigate();
	const handleGuildNameChange = (e: ChangeEvent<HTMLInputElement>) =>
		setGuildName(e.target.value);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submit(guildName);
	}

	const submit = useCallback(async (guildName: string) => {
		try {
			const res = await fetch(`${API}/api/guilds`, {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ name: guildName })

			});
			const json = await res.json();
			if (!res.ok) {
				newError({
					id: self.crypto.randomUUID(),
					title: "Error",
					error:
						res.status === 400
							? "Invalid Credentials"
							: `${res.status}: ${json.message}`,
				});
			}
			navigate(`/g/${guildName}`);
		} catch (err: any) {
			console.error(err);
			newError({
				id: self.crypto.randomUUID(),
				title: "Error",
				error: String(err),
			});
		}
	}, [])

	return (
		<div className="loginContainer">
			<div className="loginWrapper">
				<form onSubmit={handleSubmit} className="loginForm">
					<h1>Create Guild</h1>
					<label>
						Guild Name: <br />
						<input
							type="text"
							value={guildName}
							onChange={handleGuildNameChange}
						/>
					</label>
					<br />
					<button type="submit" className="primary-btn">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default CreateGuild;
