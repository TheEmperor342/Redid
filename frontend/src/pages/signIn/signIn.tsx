import { Navigate, useLocation, useNavigate } from "react-router-dom";
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useState,
} from "react";
import API from "@src/apiPath";
import { TokenContext } from "@src/TokenContext";
import { GenericPageProps } from "@types";

const SignIn: React.FC<GenericPageProps> = ({ newError }) => {
  const location = useLocation();

  const { token, setToken } = useContext(TokenContext);
  if (token !== null)
    return <Navigate to="/" state={{ from: location }} replace />;

  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
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
      const res = await fetch(`${API}/api/auth/sign-in`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        newError({
          id: self.crypto.randomUUID(),
          title: "Error",
          error:
            res.status === 400
              ? "Invalid Credentials"
              : "Unknown error occured",
        });

        return;
      }
      const json = await res.json();
      setToken(json.token);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      newError({
        id: self.crypto.randomUUID(),
        title: "Error",
        error: String(err),
      });
    }
  }, []);

  return (
    <div className="loginContainer">
      <div className="loginWrapper">
        <form onSubmit={handleSubmit} className="loginForm">
          <h1>Sign in to Redid</h1>
          <label>
            Username: <br />
            <input
              type="text"
              value={usernameVal}
              onChange={handleUsernameChange}
            />
          </label>
          <br />
          <label>
            Password: <br />
            <input
              type="password"
              value={passwordVal}
              onChange={handlePasswordChange}
            />
          </label>
          <br />
          <button type="submit" className="primary-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
