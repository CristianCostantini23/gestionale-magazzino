import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex flex-1">
        <div className="flex-1 p-4 overflow-auto border-r">
          <Outlet context={{ section: "list" }} />
        </div>
        {/* <div className="w-[400px] p-4 border-l">
          <Outlet context={{ section: "form" }} />
        </div> */}
      </main>
    </div>
  );
}
