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
import DoctorPrescriptionsList from "./pages/DoctorPrescriptionsList";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Patient */}
        <Route path="/patient" element={<PatientDashboard />} />
        <Route
          path="/patient/prescriptions"
          element={<PatientPrescription />}
        />

        {/* Doctor */}
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route
          path="/doctor/prescription"
          element={<DoctorPrescription />}
        />
        <Route path="/doctor/prescription" element={<DoctorPrescriptionsList/>}/>

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
