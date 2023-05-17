import { useEffect, useState } from "react";
import Card from "../../components/card/card";
import API from "../../apiPath";
import "./index.css";
import { homeProps, IPost } from "../../types";

export default ({ token, newError }: homeProps) => {
	const [data, setData] = useState<IPost[]>([]);
	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMounted, setHasMounted] = useState<boolean>(false);

	useEffect(() => {
		setHasMounted(true);
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
	}, []);

	useEffect(() => {
		if (!hasMounted) return;

		newError({id: self.crypto.randomUUID(), title: "Couldn't load posts", error: "Couldn't fetch posts from the servers. Maybe try again."})
	}, [error])

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
