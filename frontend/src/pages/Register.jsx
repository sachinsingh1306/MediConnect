import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    age: "",
    bloodGroup: "",
    address: "",
    specialization: "",
    experience: "",
    department: "",
    adminCode: "",
  });

  // Handle role selection
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setForm({ ...form, role: selectedRole });
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Password validation
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const { confirmPassword, ...data } = form; // remove confirmPassword
      await API.post("/auth/register", data);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {/* ROLE SELECT */}
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>

        {role && (
          <form onSubmit={handleSubmit}>
            {/* COMMON FIELDS */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
            />

            {/* PATIENT FORM */}
            {role === "patient" && (
              <>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  required
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded"
                />

                <select
                  name="bloodGroup"
                  required
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded"
                >
                  <option value="">Select Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>

                <textarea
                  name="address"
                  placeholder="Address"
                  required
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded"
                />
              </>
            )}

            {/* PASSWORDS */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
            />

            {/* DOCTOR FORM */}
            {role === "doctor" && (
              <>
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  required
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded"
                />

                <input
                  type="number"
                  name="experience"
                  placeholder="Experience (Years)"
                  required
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded"
                />

                <select
                  name="department"
                  value={form.department}
                  required
                  onChange={handleChange}
                  className="w-full mb-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Select Department --</option>
                  <option value="general_medicine">General Medicine</option>
                  <option value="general_surgery">General Surgery</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="gynecology">Gynecology</option>
                  <option value="obstetrics">Obstetrics</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="ent">ENT (Ear, Nose & Throat)</option>
                  <option value="ophthalmology">Ophthalmology</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="radiology">Radiology</option>
                  <option value="anesthesiology">Anesthesiology</option>
                  <option value="pathology">Pathology</option>
                  <option value="pulmonology">Pulmonology</option>
                  <option value="gastroenterology">Gastroenterology</option>
                  <option value="nephrology">Nephrology</option>
                  <option value="urology">Urology</option>
                  <option value="oncology">Oncology</option>
                  <option value="endocrinology">Endocrinology</option>
                  <option value="rheumatology">Rheumatology</option>
                  <option value="emergency">Emergency Medicine</option>
                  <option value="icu">Intensive Care Unit (ICU)</option>
                  <option value="physiotherapy">Physiotherapy</option>
                  <option value="dental">Dental</option>
                </select>
              </>
            )}

            {/* ADMIN FORM */}
            {role === "admin" && (
              <input
                type="password"
                name="adminCode"
                placeholder="Admin Secret Code"
                required
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Register as {role}
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 cursor-pointer"
              >
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
