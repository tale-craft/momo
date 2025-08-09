// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AppProviders } from "./providers/AppProviders.tsx";
import "./index.css";
import "@fontsource/jetbrains-mono"; // Import fonts
import "@fontsource/inter";
import "./i18n/config";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
