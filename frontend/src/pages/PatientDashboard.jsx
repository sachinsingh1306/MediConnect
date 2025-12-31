import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function PatientDashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // 🔒 Auth guard
  if (!token || role !== "patient") {
    return <Navigate to="/login" replace />;
  }

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= FETCH DOCTORS ================= */
  const fetchDoctors = async (dept) => {
    try {
      const res = await API.get(`/appointments/doctors/${dept}`);
      setDoctors(res.data);
    } catch {
      alert("Failed to load doctors");
    }
  };

  /* ================= FETCH APPOINTMENTS ================= */
  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/my");
      setAppointments(res.data);
    } catch {
      alert("Failed to load appointments");
    }
  };

  /* ================= BOOK APPOINTMENT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/appointments", { ...form, department });
      setForm({
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        age: "",
        bloodGroup: "",
        address: "",
      });
      fetchAppointments();
      alert("Appointment booked");
    } catch {
      alert("Booking failed");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>

      {/* 🔥 VIEW PRESCRIPTIONS BUTTON (IMPORTANT FIX) */}
      <button
        onClick={() => navigate("/patient/prescriptions")}
        className="mb-6 bg-purple-600 text-white px-4 py-2 rounded"
      >
        View My Prescriptions
      </button>

      {/* ================= DEPARTMENT ================= */}
      <select
        value={department}
        onChange={(e) => {
          setDepartment(e.target.value);
          fetchDoctors(e.target.value);
        }}
        className="mb-4 p-2 border rounded w-full"
      >
        <option value="">Select Department</option>
        <option value="cardiology">Cardiology</option>
        <option value="neurology">Neurology</option>
        <option value="general_surgery">General Surgery</option>
        <option value="general_medicine">General Medicine</option>
      </select>

      {/* ================= BOOKING FORM ================= */}
      {department && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded mb-6">
          <select
            name="doctorId"
            value={form.doctorId}
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

          <input
            type="date"
            name="date"
            required
            value={form.date}
            onChange={handleChange}
            className="mb-3 p-2 border w-full"
          />

          <input
            type="time"
            name="time"
            required
            value={form.time}
            onChange={handleChange}
            className="mb-3 p-2 border w-full"
          />

          <textarea
            name="reason"
            placeholder="Reason"
            required
            value={form.reason}
            onChange={handleChange}
            className="mb-3 p-2 border w-full"
          />

          <input
            name="age"
            placeholder="Age"
            required
            value={form.age}
            onChange={handleChange}
            className="mb-3 p-2 border w-full"
          />

          <input
            name="bloodGroup"
            placeholder="Blood Group"
            required
            value={form.bloodGroup}
            onChange={handleChange}
            className="mb-3 p-2 border w-full"
          />

          <textarea
            name="address"
            placeholder="Address"
            required
            value={form.address}
            onChange={handleChange}
            className="mb-3 p-2 border w-full"
          />

          <button className="bg-blue-600 text-white py-2 w-full rounded">
            Book Appointment
          </button>
        </form>
      )}

      {/* ================= APPOINTMENTS TABLE ================= */}
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
                <td className="border p-2 capitalize">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
