import { NavLink } from "react-router-dom";
import { Home, Truck, Building2, ShoppingCart } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: <Home size={24} /> },
  { to: "/strutture", label: "Strutture", icon: <Building2 size={24} /> },
  { to: "/fornitori", label: "Fornitori", icon: <Truck size={24} /> },
  { to: "/vendite", label: "Vendite", icon: <ShoppingCart size={24} /> },
];

export default function Sidebar() {
  return (
    <aside className="max-w-64 w-1/3 bg-gradient-to-t from-gray-700 to-gray-500 text-white py-3">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-2xl w-full transition-colors ${
                isActive
                  ? "font-bold text-blue-300 text-3xl bg-gray-700"
                  : "text-white text-2xl hover:bg-gray-700"
              }`
            }
          >
            {link.icon}
            <span className="font-title">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
