import Home from "./pages/home";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import SignUp from "./pages/signUp";

export default () => {

	return (
	<>
		<Navbar/>
		<Routes>
			<Route path='/' element={<Home/>}/>
			<Route path='/sign-up' element={<SignUp/>}/>
		</Routes>
	</>);
}
