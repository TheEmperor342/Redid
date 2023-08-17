import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AppWithContext } from "@src/TokenContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter>
    <AppWithContext />
  </HashRouter>,
);
