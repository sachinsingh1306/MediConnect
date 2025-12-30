import { useEffect, useState } from "react";
import API from "../api/axios";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [department, setDepartment] = useState("");

  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
    age: "",
    bloodGroup: "",
    address: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* FETCH DOCTORS */
  const fetchDoctors = async (dept) => {
    const res = await API.get(`/appointments/doctors/${dept}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDoctors(res.data);
  };

  /* BOOK */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post(
      "/appointments",
      { ...form, department },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchAppointments();
    alert("Appointment booked");
  };

  /* MY APPOINTMENTS */
  const fetchAppointments = async () => {
    const res = await API.get("/appointments/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>

      {/* DEPARTMENT */}
      <select
        onChange={(e) => {
          setDepartment(e.target.value);
          fetchDoctors(e.target.value);
        }}
        className="mb-4 p-2 border rounded w-full"
      >
        <option value="">Select Department</option>
        <option value="cardiology">Cardiology</option>
        <option value="neurology">Neurology</option>
        <option value="	general_surgery">	General Surgery</option>
        <option value="general_medicine">General Medicine</option>
      </select>

      {/* FORM */}
      {department && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded mb-6">
          <select
            name="doctorId"
            onChange={handleChange}
            required
            className="mb-3 p-2 border w-full"
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <input type="date" name="date" onChange={handleChange} required className="mb-3 p-2 border w-full" />
          <input type="time" name="time" onChange={handleChange} required className="mb-3 p-2 border w-full" />
          <textarea name="reason" placeholder="Reason" onChange={handleChange} required className="mb-3 p-2 border w-full" />
          <input name="age" placeholder="Age" onChange={handleChange} className="mb-3 p-2 border w-full" />
          <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} className="mb-3 p-2 border w-full" />
          <textarea name="address" placeholder="Address" onChange={handleChange} className="mb-3 p-2 border w-full" />

          <button className="bg-blue-600 text-white py-2 w-full rounded">
            Book Appointment
          </button>
        </form>
      )}

      {/* TABLE */}
      <div className="bg-white p-6 rounded">
        <h2 className="text-xl font-semibold mb-3">My Appointments</h2>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td className="border p-2">{a.doctorId?.name}</td>
                <td className="border p-2">{a.department}</td>
                <td className="border p-2">{a.date}</td>
                <td className="border p-2">{a.time}</td>
                <td className="border p-2">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
