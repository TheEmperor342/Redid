import React, { useContext } from "react";
import { settingsProps } from "../../types";
import { Navigate, useLocation } from "react-router-dom";
import { TokenContext } from "../../TokenContext";

const Settings: React.FC<settingsProps> = ({ newError }) => {
  const location = useLocation();

  const { token } = useContext(TokenContext);
  if (token === null)
    return <Navigate to="/sign-in" state={{ from: location }} replace />;

  const tokenDecoded = JSON.parse(atob(token.split(".")[1]));
  const username = tokenDecoded.username;

  if (username.trim() === "" || !username) {
    newError({
      id: self.crypto.randomUUID(),
      title: "Invalid token",
      error: "Your token seems to be manipulated. Please logout and relogin.",
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return (
    <div className="settings">
      <h1>{username}</h1>
    </div>
  );
};

export default Settings;
