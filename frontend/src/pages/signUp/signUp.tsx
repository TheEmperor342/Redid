import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useState,
} from "react";
import API from "@src/apiPath";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { TokenContext } from "@src/TokenContext";

export default () => {
  const location = useLocation();

  const { token, setToken } = useContext(TokenContext);

  if (token !== null)
    return <Navigate to="/" state={{ from: location }} replace />;

  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [error, setError] = useState({ error: false, message: "" });
  const navigate = useNavigate();

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameVal(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordVal(e.target.value);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(usernameVal, passwordVal);
  };

  const submit = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch(`${API}/api/auth/sign-up`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError({
          error: true,
          message:
            res.statusText === "Conflict"
              ? "User exists"
              : "Unknown error occured",
        });

        return;
      }
      const json = await res.json();
      setToken(json.token);
      navigate("/");
    } catch (err: any) {
      console.log(err);
      setError({ error: true, message: "Unknown error occured" });
    }
  }, []);

  return (
    <div className="loginContainer">
      <div className="loginWrapper">
        <form className="loginForm" onSubmit={handleSubmit}>
          <h1>Sign up to RedditClone</h1>
          {error.error && (
            <p>
              <strong>Error: </strong>
              {error.message}
            </p>
          )}
          <label>
            Username: <br />
            <input
              type="text"
              value={usernameVal}
              onChange={handleUsernameChange}
            />
          </label>{" "}
          <br />
          <label>
            Password: <br />
            <input
              type="password"
              value={passwordVal}
              onChange={handlePasswordChange}
            />
          </label>{" "}
          <br />
          <button type="submit" className="primary-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
