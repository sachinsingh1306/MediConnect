import { useState } from "react";
import API from "../api/axios";

export default function DoctorPrescription() {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "" },
  ]);
  const [notes, setNotes] = useState("");

  const token = localStorage.getItem("token");
  const appointmentId = localStorage.getItem("appointmentId");

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  };

  const handleMedicineChange = (i, e) => {
    const updated = [...medicines];
    updated[i][e.target.name] = e.target.value;
    setMedicines(updated);
  };

  const submitPrescription = async () => {
    await API.post(
      "/prescriptions",
      { appointmentId, medicines, notes },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Prescription created");
    window.location.href = "/doctor";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Prescription</h1>

      {medicines.map((m, i) => (
        <div key={i} className="mb-3">
          <input
            placeholder="Medicine Name"
            name="name"
            onChange={(e) => handleMedicineChange(i, e)}
            className="w-full p-2 border mb-1"
          />
          <input
            placeholder="Dosage"
            name="dosage"
            onChange={(e) => handleMedicineChange(i, e)}
            className="w-full p-2 border mb-1"
          />
          <input
            placeholder="Duration"
            name="duration"
            onChange={(e) => handleMedicineChange(i, e)}
            className="w-full p-2 border"
          />
        </div>
      ))}

      <button onClick={addMedicine} className="mb-4 text-blue-600">
        + Add Medicine
      </button>

      <textarea
        placeholder="Doctor Notes"
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 border mb-4"
      />

      <button
        onClick={submitPrescription}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Save Prescription
      </button>
    </div>
  );
}
