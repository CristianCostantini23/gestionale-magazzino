import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import "./style.css";
import ProdottiPage from "./pages/ProdottiPage.jsx";
import BrandsPage from "./pages/BrandsPage.jsx";
import EntitaPage from "./pages/EntitaPage.jsx";
import FornitoriPage from "./pages/FornitoriPage.jsx";
import ScarichiPage from "./pages/ScarichiPage.jsx";
import VenditePage from "./pages/VenditePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // path per prodotti
      {
        path: "prodotti",
        element: <ProdottiPage />,
      },
      {
        path: "prodotti",
        element: <ProdottiPage />,
      },
      // path per brands
      {
        path: "brands",
        element: <BrandsPage />,
      },
      {
        path: "brands",
        element: <BrandsPage />,
      },
      // path per entità
      {
        path: "entita",
        element: <EntitaPage />,
      },
      {
        path: "entita",
        element: <EntitaPage />,
      },
      // path per fornitori
      {
        path: "fornitori",
        element: <FornitoriPage />,
      },
      {
        path: "fornitori",
        element: <FornitoriPage />,
      },
      // path per scarichi merce
      {
        path: "scarichi",
        element: <ScarichiPage />,
      },
      {
        path: "scarichi",
        element: <ScarichiPage />,
      },
      // path per vendite
      {
        path: "vendita",
        element: <VenditePage />,
      },
      {
        path: "vendite",
        element: <VenditePage />,
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
