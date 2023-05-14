import { useEffect, useState } from "react";
import Card from "../../components/card/card";
import API from "../../apiPath";
import "./index.css";

interface IPost {
	_id: string;
	poster: string;
	guild: string;
	title: string;
	content: string;
	likes: number;
}

export default () => {
	const [data, setData] = useState<IPost[]>([]);
	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch(`${API}/api/posts`, { mode: "cors" })
			.then(res => {
				if (res.ok) return res.json();
				else throw res;
			})
			.then(json => {
				setData(json.data);
			})
			.catch(err => {
				console.log(err);
				setError(true);
			})
			.finally(() => setIsLoading(false));
	}, [])

	return (
		<div className="content">
			{isLoading && <h1>Loading</h1>}
			{error && <h1>Error</h1>}
			{data.map(el =>
				<Card key={el._id} poster={el.poster} guild={el.guild} title={el.title} content={el.content} likes={el.likes} />
			)}
		</div>
	);
}
