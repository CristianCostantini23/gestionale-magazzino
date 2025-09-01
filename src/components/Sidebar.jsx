import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Truck,
  Building2,
  ShoppingCart,
  Package,
  ArrowLeftRight,
  ChevronDown,
  Barcode,
} from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: <Home size={24} /> },
  { to: "/prodotti", label: "Prodotti", icon: <Barcode size={24} /> },
  { to: "/strutture", label: "Strutture", icon: <Building2 size={24} /> },
  { to: "/fornitori", label: "Fornitori", icon: <Package size={24} /> },
  {
    label: "Vendite",
    icon: <ShoppingCart size={24} />,
    children: [
      { to: "/vendite", label: "Tutte le vendite" },
      { to: "/vendite/aggiungi", label: "Aggiungi vendita" },
    ],
  },
  {
    label: "Scarichi",
    icon: <Truck size={24} />,
    children: [
      { to: "/scarichi", label: "Tutti gli scarichi" },
      { to: "/scarichi/aggiungi", label: "Aggiungi scarico" },
    ],
  },
  {
    label: "Movimenti",
    icon: <ArrowLeftRight size={24} />,
    children: [
      { to: "/movimenti", label: "Tutti i movimenti" },
      { to: "/movimenti/aggiungi", label: "Aggiungi movimento" },
    ],
  },
];

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0  lg:hidden z-40"
        ></div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-700 p-2 rounded-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
          />
        </svg>
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-t from-gray-700 to-gray-500 text-white py-3 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-64 w-64 z-50`}
      >
        <nav className="flex flex-col space-y-2">
          {links.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  onClick={() => toggleMenu(link.label)}
                  className="flex items-center justify-between gap-3 p-2 rounded-2xl w-full text-2xl hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span className="font-title">{link.label}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${
                      openMenus[link.label] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openMenus[link.label] && (
                  <div className="ml-8 mt-1 flex flex-col space-y-1">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          `block p-2 rounded-xl text-lg transition-colors ${
                            isActive
                              ? "font-bold text-blue-300 bg-gray-700"
                              : "text-white hover:bg-gray-700"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
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
            )
          )}
        </nav>
      </aside>
    </>
  );
}
