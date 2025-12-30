import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import Navbar from "./components/Navbar";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientPrescription from "./pages/PatientPrescription";
import DoctorPrescription from "./pages/DoctorPrescription";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/doctor/prescription" element={<DoctorPrescription />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
