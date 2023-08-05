import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Four04: React.FC = () => (
	<div className="_404">
		<h1>404</h1>
		<p>Go back to <Link to="/">home</Link> kid, you don't belong here.</p>
	</div>
);

export default Four04;
