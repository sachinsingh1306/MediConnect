import { useEffect, useState } from "react";
import API from "../api/axios";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/doctor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(res.data);
    } catch (err) {
      alert("Failed to load appointments");
    }
  };

  // Update appointment status
  const updateStatus = async (id, status) => {
    try {
      await API.put(
        `/appointments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 FRONTEND LOGIC
      if (status === "rejected") {
        setAppointments((prev) =>
          prev.filter((a) => a._id !== id)
        );
      } else {
        fetchAppointments();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    }
  };

  useEffect(() => {
    if (!token || role !== "doctor") {
      window.location.href = "/login";
      return;
    }
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      {appointments.length === 0 ? (
        <p>No appointments available</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td className="p-2 border">
                    {a.patientId?.name}
                  </td>
                  <td className="p-2 border">{a.date}</td>
                  <td className="p-2 border">{a.time}</td>
                  <td className="p-2 border">{a.reason}</td>
                  <td className="p-2 border capitalize">
                    {a.status}
                  </td>

                  <td className="p-2 border space-x-2">
                    {a.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(a._id, "accepted")
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(a._id, "rejected")
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {a.status === "accepted" && (
                      <button
                        onClick={() =>
                          updateStatus(a._id, "completed")
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
