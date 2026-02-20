import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../app/AuthContext";
import { LogOut, User } from "lucide-react";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="h-16 bg-gradient-to-r from-[#020617] to-[#020617]/90 
      border-b border-gray-800 flex items-center justify-between px-8 text-white max-w-8xl mx-auto w-full">

      {/* Logo */}
      <h1 className="text-xl font-semibold tracking-wide">
        Notes<span className="text-indigo-400">Pro</span>
      </h1>

      {/* Profile */}
      <div className="relative" ref={dropdownRef}>
        <img
          src={`https://ui-avatars.com/api/?name=${user?.username || "U"}&background=6366f1&color=fff`}
          alt="profile"
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full cursor-pointer 
            border border-gray-700 hover:border-indigo-500 transition"
        />

        {open && (
          <div
            className="absolute right-0 mt-3 w-52 
              bg-[#020617] border border-gray-800 
              rounded-xl shadow-xl animate-fadeIn"
          >
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-sm font-medium flex items-center gap-2">
                <User size={14} />
                {user?.username || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={logout}
              className="w-full px-4 py-3 text-left text-sm 
                text-red-400 hover:bg-red-500/10 
                flex items-center gap-2 rounded-b-xl transition duration-200 cursor-pointer"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
