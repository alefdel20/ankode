import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Legal from "./pages/Legal.jsx";
import PagoResultado from "./pages/PagoResultado.jsx";
import WebServiceOrder from "./pages/WebServiceOrder.jsx";
import WebContratar from "./pages/WebContratar.jsx";
import WebSuccessScreen from "./pages/WebSuccessScreen.jsx";

const path = window.location.pathname;
const root = createRoot(document.getElementById("root"));

if (path === '/legal') {
  root.render(
    <StrictMode>
      <Legal />
    </StrictMode>
  );
} else if (path === '/pago-resultado') {
  root.render(
    <StrictMode>
      <PagoResultado />
    </StrictMode>
  );
} else if (path === '/paginas-web') {
  root.render(
    <StrictMode>
      <WebServiceOrder />
    </StrictMode>
  );
} else if (path === '/paginas-web/contratar') {
  root.render(
    <StrictMode>
      <WebContratar />
    </StrictMode>
  );
} else if (path === '/paginas-web/gracias') {
  root.render(
    <StrictMode>
      <WebSuccessScreen />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
