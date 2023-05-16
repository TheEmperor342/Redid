import { ErrorsState } from "../../types";

export default ({ errors, remove }: { errors: ErrorsState[], remove: (error: ErrorsState) => void }) => {
	return (
		<div className="errors">
			{errors.map(el =>
				<Error key={el.id} error={el} remove={remove} />
			)}
		</div>
	);
}

const Error = ({ error, remove }: { error: ErrorsState, remove: (error: ErrorsState) => void }) => {
	setTimeout(() => {remove(error)}, 3000);
	return (
		<div className="error">
			<h3>{error.title}</h3>
			<p>{error.error}</p>
		</div>
	);
}
