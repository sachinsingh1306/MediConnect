import { useEffect, useState } from "react";
import API from "../api/axios";

export default function PatientPrescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get("/prescriptions/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API response:", res.data); // ✅ DEBUG
        setPrescriptions(res.data);
      } catch (err) {
        alert("Failed to load prescriptions");
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Prescriptions</h1>

      {prescriptions.length === 0 ? (
        <p className="text-gray-600">No prescriptions found</p>
      ) : (
        prescriptions.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 mb-4 rounded shadow"
          >
            <p><b>Doctor:</b> {p.doctorId?.name}</p>
            <p><b>Date:</b> {new Date(p.createdAt).toLocaleDateString()}</p>

            <p className="mt-2 font-semibold">Medicines:</p>
            <ul className="list-disc ml-6">
              {p.medicines.map((m, i) => (
                <li key={i}>
                  {m.name} – {m.dosage} – {m.duration}
                </li>
              ))}
            </ul>

            {p.notes && (
              <p className="mt-2"><b>Notes:</b> {p.notes}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
