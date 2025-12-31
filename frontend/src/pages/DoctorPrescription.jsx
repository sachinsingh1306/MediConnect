import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function DoctorPrescription() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "" },
  ]);
  const [notes, setNotes] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const appointmentId = localStorage.getItem("appointmentId");

  // ======================
  // SAFETY CHECK
  // ======================
  useEffect(() => {
    if (!token || role !== "doctor") {
      alert("Unauthorized");
      navigate("/login");
      return;
    }

    if (!appointmentId) {
      alert("No appointment selected");
      navigate("/doctor");
    }
  }, []);

  // ======================
  // ADD MEDICINE
  // ======================
  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  };

  // ======================
  // HANDLE CHANGE
  // ======================
  const handleMedicineChange = (i, e) => {
    const updated = [...medicines];
    updated[i][e.target.name] = e.target.value;
    setMedicines(updated);
  };

  // ======================
  // SUBMIT
  // ======================
  const submitPrescription = async () => {
    try {
      console.log("Sending:", { appointmentId, medicines, notes });

      await API.post(
        "/prescriptions",
        { appointmentId, medicines, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Prescription created successfully");
      localStorage.removeItem("appointmentId");
      navigate("/doctor");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save prescription");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Prescription</h1>

      {medicines.map((m, i) => (
        <div key={i} className="mb-3">
          <input
            placeholder="Medicine Name"
            name="name"
            value={m.name}
            onChange={(e) => handleMedicineChange(i, e)}
            className="w-full p-2 border mb-1"
            required
          />
          <input
            placeholder="Dosage"
            name="dosage"
            value={m.dosage}
            onChange={(e) => handleMedicineChange(i, e)}
            className="w-full p-2 border mb-1"
            required
          />
          <input
            placeholder="Duration"
            name="duration"
            value={m.duration}
            onChange={(e) => handleMedicineChange(i, e)}
            className="w-full p-2 border"
            required
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addMedicine}
        className="mb-4 text-blue-600"
      >
        + Add Medicine
      </button>

      <textarea
        placeholder="Doctor Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 border mb-4"
      />

      <button
        onClick={submitPrescription}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Save Prescription
      </button>
    </div>
  );
}
