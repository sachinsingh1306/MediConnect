import { useEffect, useState } from "react";
import API from "../api/axios";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    API.get("/appointments/my").then((res) => setAppointments(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      {appointments.map((a) => (
        <div key={a._id} className="border p-3 mb-2 rounded">
          <p><b>Date:</b> {a.date}</p>
          <p><b>Status:</b> {a.status}</p>
          <p><b>Reason:</b> {a.reason}</p>
        </div>
      ))}
    </div>
  );
}
