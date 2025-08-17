import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import "./style.css";
import Homepage from "./pages/Homepage.jsx";
import PaginaStrutture from "./pages/paginaStrutture.jsx";
import InventarioStruttura from "./pages/InventarioStruttura.jsx";
import PaginaFornitori from "./pages/paginaFornitori.jsx";

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
      // STRUTTURE
      {
        path: "strutture",
        element: <PaginaStrutture />,
      },
      // INVENTARI
      {
        path: "strutture/:strutturaId",
        element: <InventarioStruttura />,
      },
      // FORNITORI
      {
        path: "fornitori",
        element: <PaginaFornitori />,
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
