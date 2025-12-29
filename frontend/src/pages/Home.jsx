import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900 overflow-hidden">

      {/* Hero */}
      <section className="relative pt-24 pb-32 text-center">
        {/* Decorative blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6">
          <span className="inline-block mb-6 px-5 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
            🚀 Smart Healthcare Platform
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Healthcare management
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              reimagined.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Book appointments, manage prescriptions, and control hospital workflows —
            all in one seamless system.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/register"
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-xl hover:scale-105 transition"
            >
              Create Account
            </Link>
            <button className="px-10 py-4 rounded-xl border border-gray-300 bg-white font-bold text-lg hover:bg-gray-50 transition">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Built for Everyone
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              A single platform designed for patients, doctors, and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: "👨‍⚕️",
                title: "Patients",
                desc: "Instant booking, digital prescriptions, and easy access to medical history.",
                color: "from-blue-500 to-blue-700"
              },
              {
                icon: "🩺",
                title: "Doctors",
                desc: "Manage appointments, patients, and prescriptions effortlessly.",
                color: "from-indigo-500 to-indigo-700"
              },
              {
                icon: "🛡️",
                title: "Admins",
                desc: "Full control over users, verification, and system monitoring.",
                color: "from-slate-600 to-slate-800"
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white/70 backdrop-blur-lg border border-gray-100 rounded-3xl p-8 shadow-md hover:shadow-2xl transition hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-3xl text-white mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-gray-900">© {new Date().getFullYear()} MedCare</span>
          <div className="flex gap-6 text-gray-500">
            <a className="hover:text-blue-600" href="#">Privacy</a>
            <a className="hover:text-blue-600" href="#">Terms</a>
            <a className="hover:text-blue-600" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}