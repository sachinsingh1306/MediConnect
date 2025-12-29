import { useEffect, useState } from "react";
import API from "../api/axios";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    API.get("/appointments/doctor").then((res) => setAppointments(res.data));
  }, []);

  const updateStatus = (id, status) => {
    API.put(`/appointments/${id}/status`, { status })
      .then(() => window.location.reload());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Doctor Appointments</h2>

      {appointments.map((a) => (
        <div key={a._id} className="border p-3 mb-2 rounded">
          <p><b>Patient:</b> {a.patientId.name}</p>
          <p><b>Status:</b> {a.status}</p>

          <button
            onClick={() => updateStatus(a._id, "accepted")}
            className="bg-green-600 text-white px-3 py-1 mr-2 rounded"
          >
            Accept
          </button>

          <button
            onClick={() => updateStatus(a._id, "rejected")}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
