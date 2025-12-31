import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";


export default function DoctorPrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/prescriptions/doctor", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setPrescriptions(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Prescriptions</h1>

      {prescriptions.map((p) => (
        <div
          key={p._id}
          className="bg-white p-4 shadow rounded mb-3"
        >
          <p><b>Patient:</b> {p.patientId.name}</p>
          <p><b>Date:</b> {p.appointmentId.date}</p>

          <button
            onClick={() => navigate(`/doctor/prescription/${p._id}`)}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
          >
            View / Edit
          </button>
        </div>
      ))}
    </div>
  );
}
