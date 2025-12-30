import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [view, setView] = useState("doctors"); // doctors | patients

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // =========================
  // FETCH ALL USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  // =========================
  // FETCH ALL PATIENTS
  // =========================
  const fetchPatients = async () => {
    try {
      const res = await API.get("/admin/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      alert("Failed to load patients");
    }
  };

  // =========================
  // APPROVE DOCTOR
  // =========================
  const approveDoctor = async (id) => {
    try {
      await API.put(
        `/admin/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert("Approval failed");
    }
  };

  // =========================
  // BLOCK / UNBLOCK USER
  // =========================
  const toggleBlock = async (id) => {
    try {
      await API.put(
        `/admin/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert("Block action failed");
    }
  };

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    if (!token || role !== "admin") {
      window.location.href = "/login";
      return;
    }
    fetchUsers();
  }, []);

  const doctors = users.filter((u) => u.role === "doctor");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* TOGGLE BUTTONS */}
      <div className="mb-6 space-x-4">
        <button
          onClick={() => setView("doctors")}
          className={`px-4 py-2 rounded ${
            view === "doctors" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Doctors
        </button>

        <button
          onClick={() => {
            setView("patients");
            fetchPatients();
          }}
          className={`px-4 py-2 rounded ${
            view === "patients" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Patients
        </button>
      </div>

      {/* ================= DOCTORS TABLE ================= */}
      {view === "doctors" && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((u) => (
                <tr key={u._id}>
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.department}</td>

                  <td className="p-2 border">
                    {u.isBlocked ? (
                      <span className="text-red-600 font-semibold">Blocked</span>
                    ) : u.isApproved ? (
                      <span className="text-green-600 font-semibold">
                        Approved
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-2 border space-x-2">
                    {!u.isApproved && (
                      <button
                        onClick={() => approveDoctor(u._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                    )}

                    {u.isApproved && (
                      <button
                        onClick={() => toggleBlock(u._id)}
                        className={`px-3 py-1 rounded text-white ${
                          u.isBlocked
                            ? "bg-blue-600"
                            : "bg-red-600"
                        }`}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= PATIENTS TABLE ================= */}
      {view === "patients" && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Blood Group</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((p) => (
                <tr key={p._id}>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.email}</td>
                  <td className="p-2 border">{p.age}</td>
                  <td className="p-2 border">{p.bloodGroup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
