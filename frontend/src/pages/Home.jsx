import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h2 className="text-4xl font-bold mb-4">
          Online Medical Appointment System
        </h2>
        <p className="text-lg mb-6">
          Book appointments, manage patients, and prescribe digitally
        </p>
        <Link
          to="/register"
          className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-200"
        >
          Get Started
        </Link>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-10">
          Features
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Patient */}
          <div className="bg-white p-6 rounded shadow text-center">
            <h4 className="text-xl font-semibold mb-2">👨‍⚕️ Patient</h4>
            <p>
              Book appointments, track status, and view prescriptions easily.
            </p>
          </div>

          {/* Doctor */}
          <div className="bg-white p-6 rounded shadow text-center">
            <h4 className="text-xl font-semibold mb-2">🩺 Doctor</h4>
            <p>
              Manage appointments, update status, and write prescriptions.
            </p>
          </div>

          {/* Admin */}
          <div className="bg-white p-6 rounded shadow text-center">
            <h4 className="text-xl font-semibold mb-2">🛡 Admin</h4>
            <p>
              Approve doctors, manage users, and oversee the platform.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        © {new Date().getFullYear()} MedCare. All rights reserved.
      </footer>
    </div>
  );
}
