import { createContext, useState } from "react";
import { TokenContextProps } from "@types";
import React from "react";
import App from "@src/App";

export const TokenContext = createContext<TokenContextProps>({
  token: null,
  setToken: () => { },
});
export const AppWithContext: React.FC = () => {
  const [tokenString, setTokenString] = useState<string | null>(localStorage.getItem("token"));

  const setToken = (token: string | null) => {
    setTokenString(token);
    if (token === null) localStorage.removeItem("token");
    else localStorage.setItem("token", token);
  };

  return (
    <TokenContext.Provider value={{ token: tokenString, setToken }}>
      <App />
    </TokenContext.Provider>
  );
};

