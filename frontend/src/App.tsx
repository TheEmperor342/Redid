import { Routes, Route } from "react-router-dom";
import { ErrorsReducer, IErrorsState, ErrorsAction } from "./types";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn";
import Errors from "./components/errors";
import { useCallback, useReducer } from "react";
import Post from "./pages/post";
import Settings from "./pages/settings";
import User from "./pages/user/user";

const errorsReducer = (
  state: IErrorsState[],
  action: ErrorsAction
): IErrorsState[] => {
  switch (action.type) {
    case "append":
      return [...state, action.payload];
    case "remove":
      return [...state.filter((el) => el.id !== action.payload.id)];
    default:
      return state;
  }
};

export default () => {
  const [errors, dispatch] = useReducer<ErrorsReducer>(errorsReducer, []);

  const remove = useCallback((error: IErrorsState) => {
    dispatch({ type: "remove", payload: error });
  }, []);
  const newError = useCallback((payload: IErrorsState) => {
    dispatch({ type: "append", payload });
  }, []);

  return (
    <>
      <Navbar newError={newError} />
      <Routes>
        <Route path="/" element={<Home newError={newError} />} />
        <Route
          path="/sign-up"
          element={<SignUp/>}
        />
        <Route
          path="/sign-in"
          element={<SignIn/>}
        />
        <Route
          path="/post"
          element={<Post newError={newError} />}
        />
        <Route
          path="/settings"
          element={<Settings newError={newError} />}
        />
        <Route path="/u/:username" element={<User newError={newError}/>}/>
      </Routes>
      <Errors errors={errors} remove={remove} />
    </>
  );
};
