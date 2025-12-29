import { useEffect, useState } from "react";
import API from "../api/axios";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    doctor: "",
    date: "",
    time: "",
    reason: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Book appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/appointments", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Appointment booked");
      setForm({ doctor: "", date: "", time: "", reason: "" });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Error booking appointment");
    }
  };

  // Fetch my appointments
  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>

      {/* Book Appointment */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>

        <input
          name="doctor"
          placeholder="Doctor Name"
          value={form.doctor}
          required
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          required
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="time"
          name="time"
          value={form.time}
          required
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <textarea
          name="reason"
          placeholder="Reason"
          value={form.reason}
          required
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Book
        </button>
      </form>

      {/* Appointment List */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">My Appointments</h2>

        {appointments.length === 0 ? (
          <p>No appointments yet</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Doctor</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td className="p-2 border">{a.doctor}</td>
                  <td className="p-2 border">{a.date}</td>
                  <td className="p-2 border">{a.time}</td>
                  <td className="p-2 border capitalize">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
