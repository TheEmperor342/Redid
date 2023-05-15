import Home from "./pages/home";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import SignUp from "./pages/signUp";
import { useEffect, useState } from "react";

export default () => {
	const [token, setToken] = useState<string | null>(null);
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		const tokenInLocalStorage = localStorage.getItem("token");
		if (tokenInLocalStorage !== null)
			setToken(tokenInLocalStorage);
		
		setLoaded(true);
	}, []);

	useEffect(() => {
		if (!loaded) return;
		localStorage.setItem("token", token!);
	}, [token]);

	return (
		<>
			<Navbar token={token} />
			<Routes>
				<Route path='/' element={<Home token={token} />} />
				<Route path='/sign-up' element={<SignUp token={token} setToken={setToken} />} />
			</Routes>
		</>);
}
