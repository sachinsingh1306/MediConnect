import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        MedCare
      </Link>

      {/* Links */}
      <div className="flex items-center gap-4">
        {!token && (
          <>
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}

        {token && role === "patient" && (
          <Link
            to="/patient"
            className="text-gray-600 hover:text-blue-600"
          >
            Patient Dashboard
          </Link>
        )}

        {token && role === "doctor" && (
          <Link
            to="/doctor"
            className="text-gray-600 hover:text-blue-600"
          >
            Doctor Dashboard
          </Link>
        )}

        {token && role === "admin" && (
          <Link
            to="/admin"
            className="text-gray-600 hover:text-blue-600"
          >
            Admin Dashboard
          </Link>
        )}

        {token && (
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
