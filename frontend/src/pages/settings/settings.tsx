import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { GenericPageProps } from "@types";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { TokenContext } from "@src/TokenContext";
import API from "@src/apiPath";
import { AiOutlineLink, AiFillDelete } from "react-icons/ai";
import CreateGuild from "@components/newGuild";
import "./index.css";

const Settings: React.FC<GenericPageProps> = ({ newError }) => {
  const location = useLocation();

  const { token, setToken } = useContext(TokenContext);
  if (token === null)
    return <Navigate to="/sign-in" state={{ from: location }} replace />;

  const [username, setUsername] = useState<string>("Loading username");
  const navigate = useNavigate();

  useEffect(() => {
    getUsername();
  }, []);

  const getUsername = async () => {
    const res = await fetch(`${API}/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok)
      newError({
        id: self.crypto.randomUUID(),
        title: "Couldn't fetch data",
        error: `${res.status}: ${json.message}`,
      });
    else setUsername(json.username);
  };

  const handleDelete = async () => {
    const res = await fetch(`${API}/api/auth/delete-user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (!res.ok)
      newError({
        id: self.crypto.randomUUID(),
        title: "Couldn't delete account",
        error: `${res.status}: ${res.statusText}\n${JSON.stringify(json)}`,
      });
    setToken(null);
    navigate("/");
  };
  return (
    <div className="settingsWrapper">
      <h1>{username}</h1>
      <div className="settingsWrapper__grid">
        <div>
          <p>View your posts</p>
          <Link to={`/u/${username}`}>
            <button className="primary-btn">
              <AiOutlineLink />
            </button>
          </Link>
        </div>
        <div>
          Delete Account
          <button className="primary-btn" onClick={handleDelete}>
            <AiFillDelete />
          </button>
        </div>
        <div className="settingsWrapper__grid_span2">
          <CreateGuild newError={newError} />
        </div>
        <div className="settingsWrapper__grid_span2">
          <ChangeUsername newError={newError} setUsername={setUsername} />
        </div>
      </div>
    </div>
  );
};
const ChangeUsername: React.FC<
  GenericPageProps & { setUsername: (username: string) => void }
> = ({ newError, setUsername }) => {
  const [username, setNewUsername] = useState<string>("");
  const { token } = useContext(TokenContext);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewUsername(e.target.value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const submit = async () => {
    try {
      const res = await fetch(`${API}/api/user`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });
      const json = await res.json();
      if (!res.ok)
        newError({
          id: self.crypto.randomUUID(),
          title: "Error",
          error: `${res.status}: ${json.message}`,
        });
      else setUsername(username);
    } catch (err: any) {
      console.error(err);
      newError({
        id: self.crypto.randomUUID(),
        title: "Error",
        error: String(err),
      });
    }
  };

  return (
    <div className="grid-place-items-center">
      <div className="grid-place-items-center">
        <form onSubmit={handleSubmit} className="loginForm">
          <h2>Change Username</h2>
          <label>
            New username: <br />
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
          <br />
          <button type="submit" className="primary-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
