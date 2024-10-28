import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SocketProvider } from "./context/socketContext.jsx";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </SocketProvider>
);
