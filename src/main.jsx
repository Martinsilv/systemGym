import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { GymProvider } from "./context/GymContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <GymProvider>
          <App />
          <Toaster position="top-center" />
        </GymProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
