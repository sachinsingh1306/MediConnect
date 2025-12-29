import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaUserInjured, FaUserShield, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50">
      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 blur-xl opacity-20"></div>

      <div className="relative backdrop-blur-xl bg-white/70 border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-black tracking-wide bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            MedCare+
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {!token && (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="primary-btn" to="/register">Get Started</Link>
              </>
            )}

            {token && role === "patient" && (
              <Link className="dashboard-btn" to="/patient">
                <FaUserInjured /> Patient
              </Link>
            )}

            {token && role === "doctor" && (
              <Link className="dashboard-btn" to="/doctor">
                <FaUserMd /> Doctor
              </Link>
            )}

            {token && role === "admin" && (
              <Link className="dashboard-btn" to="/admin">
                <FaUserShield /> Admin
              </Link>
            )}

            {token && (
              <button onClick={logout} className="logout-btn">
                <FaSignOutAlt />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
