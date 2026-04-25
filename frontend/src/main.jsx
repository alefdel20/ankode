import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Legal from "./pages/Legal.jsx";

const path = window.location.pathname;
const root = createRoot(document.getElementById("root"));

if (path === '/legal') {
  root.render(
    <StrictMode>
      <Legal />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
