import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPrescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [medicines, setMedicines] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    API.get(`/prescriptions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setMedicines(res.data.medicines);
      setNotes(res.data.notes);
    });
  }, []);

  const updatePrescription = async () => {
    await API.put(
      `/prescriptions/${id}`,
      { medicines, notes },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Prescription updated");
    navigate("/doctor/prescriptions");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Prescription</h1>

      {medicines.map((m, i) => (
        <div key={i} className="mb-2">
          <input
            value={m.name}
            onChange={(e) => {
              const copy = [...medicines];
              copy[i].name = e.target.value;
              setMedicines(copy);
            }}
            className="w-full border p-2 mb-1"
          />
          <input
            value={m.dosage}
            onChange={(e) => {
              const copy = [...medicines];
              copy[i].dosage = e.target.value;
              setMedicines(copy);
            }}
            className="w-full border p-2 mb-1"
          />
          <input
            value={m.duration}
            onChange={(e) => {
              const copy = [...medicines];
              copy[i].duration = e.target.value;
              setMedicines(copy);
            }}
            className="w-full border p-2"
          />
        </div>
      ))}

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <button
        onClick={updatePrescription}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Update Prescription
      </button>
    </div>
  );
}
