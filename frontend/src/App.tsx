import { Routes, Route } from "react-router-dom";
import { ErrorsReducer, ErrorsState, Action } from "./types";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn";
import Errors from "./components/errors";
import { useCallback, useEffect, useReducer, useState } from "react";

const errorsReducer = (state: ErrorsState[], action: Action): ErrorsState[] => {
	switch (action.type) {
		case "append":
			return [...state, action.payload];
		case "remove":
			return [...state.filter(el => el.id !== action.payload.id)];
		default:
			return state;
	};
}

export default () => {
	const [token, setToken] = useState<string | null>(null);
	const [loaded, setLoaded] = useState<boolean>(false);
	const [errors, dispatch] = useReducer<ErrorsReducer>(errorsReducer, [])
	
	const remove = useCallback((error: ErrorsState) => {
		dispatch({type: "remove", payload: error});
	}, [])
	const newError = useCallback((payload: ErrorsState) => {
		dispatch({type: "append", payload})
	}, []);

	useEffect(() => {
		const tokenInLocalStorage = localStorage.getItem("token");
		if (tokenInLocalStorage !== null)
			setToken(tokenInLocalStorage);

		setLoaded(true);
	}, []);

	useEffect(() => {
		if (!loaded) return;
		if (token === null) localStorage.removeItem("token");
		else localStorage.setItem("token", token);
	}, [token]);

	return (
		<>
			<Navbar token={token} newError={newError} setToken={setToken} />
			<Routes>
				<Route path='/' element={<Home token={token} newError={newError} />} />
				<Route
					path='/sign-up'
					element={<SignUp token={token} setToken={setToken} />}
				/>
				<Route
					path='/sign-in'
					element={<SignIn token={token} setToken={setToken} />}
				/>
			</Routes>
			<Errors errors={errors} remove={remove} />
		</>);
}
