// ===========================================
// #00101
// ===========================================
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-quill/dist/quill.snow.css";

import { ThemeProvider } from "@material-tailwind/react";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadScript } from "@react-google-maps/api";
import { PermissionProvider } from "./context/PermissionContext";
import { routes } from "./routes/Routes/Routes";
import CustomLoading from "./components/CustomLoading";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import "react-tree-graph/dist/style.css";
import App from "./App";

// SETTING API BASE URL
axios.defaults.baseURL = `${import.meta.env.VITE_BASE_URL}`;

// TANSTACK QUERY SETUP
const queryClient = new QueryClient();

// REACT ROUTER
const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API}
      libraries={["places"]}
      loadingElement={<CustomLoading />}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <App />
          {/* <RouterProvider router={router} /> */}
        </ThemeProvider>
      </QueryClientProvider>
    </LoadScript>
  </React.StrictMode>
);
