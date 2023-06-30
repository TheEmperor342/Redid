import { IErrorsState } from "@types";
import "./errors.css";

export default ({
  errors,
  remove,
}: {
  errors: IErrorsState[];
  remove: (error: IErrorsState) => void;
}) => (
  <div className="errors">
    {errors.map((el) => (
      <Error key={el.id} error={el} remove={remove} />
    ))}
  </div>
);

const Error = ({
  error,
  remove,
}: {
  error: IErrorsState;
  remove: (error: IErrorsState) => void;
}) => {
  setTimeout(() => {
    remove(error);
  }, 5000);
  return (
    <div className="error">
      <h3>{error.title}</h3>
      <p>{error.error}</p>
    </div>
  );
};
