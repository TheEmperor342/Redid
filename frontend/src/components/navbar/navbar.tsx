import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import API from "../../apiPath";
import { useContext } from "react";
import { TokenContext } from "../../TokenContext";
import { IErrorsState } from "../../types";

export default ({
  newError,
}: {
  newError: (payload: IErrorsState) => void;
}) => {
  const { token, setToken } = useContext(TokenContext);

  const navigate = useNavigate();
  const handleLogout = () => {
    logout(token!);
  };

  const logout = async (token: string) => {
    try {
      const res = await fetch(`${API}/api/auth/logout`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 404) {
        setToken(null);
        navigate("/");
        return;
      }
      if (!res.ok) {
        newError({
          id: self.crypto.randomUUID(),
          title: "Couldn't log you out",
          error: "Please try again later.",
        });

        return;
      }
      setToken(null);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      newError({
        id: self.crypto.randomUUID(),
        title: "Couldn't log you out",
        error: "Please try again later.",
      });
    }
  };

  return (
    <nav>
      <h3>Reddit Clone</h3>
      <div>
        <Link to="/">
          <p>Home</p>
        </Link>
        {token ? (
          <>
            <Link to="/post">
              <p>Post</p>
            </Link>
            <Link to="/settings">
              <p>Settings</p>
            </Link>
            <p> Logged In </p>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/sign-in">
              <p>Sign In</p>
            </Link>
            <Link to="/sign-up">
              <p> Sign Up</p>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
