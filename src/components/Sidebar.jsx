// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

const links = [
  { to: "/prodotti", label: "Prodotti" },
  { to: "/brands", label: "Brands" },
  { to: "/vendite", label: "Vendite" },
  { to: "/scarichi", label: "Scarichi" },
  { to: "/fornitori", label: "Fornitori" },
  { to: "/entita", label: "Entità" },
];

export default function Sidebar() {
  return (
    <aside className="max-w-64 w-1/3  bg-linear-to-t from-gray-700 to-gray-500 text-white py-3">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive
                ? "block font-bold text-blue-300 text-3xl my-1 bg-gray-700 p-2 text-start rounded-2xl w-full"
                : "block text-white text-2xl my-1 hover:bg-gray-700 p-2 text-start rounded-2xl w-full "
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
