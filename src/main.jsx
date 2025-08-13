import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import "./style.css";
import Homepage from "./pages/Homepage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // HOMEPAGE
      {
        path: "",
        element: <Homepage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
