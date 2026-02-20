import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/register" || pathname === "/login";

  
  return (
    <nav className="h-16 bg-[#0B0F19] border-b border-gray-800">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold text-white">
          Notes<span className="text-indigo-400">Pro</span>
        </Link>
      
        {/* Right side */}
        {!isAuthPage && (
          <div className="flex gap-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition py-2 px-4 rounded-md">
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-500 rounded-md text-white"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
