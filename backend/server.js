const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config(); // MUST be first

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/admin", adminRoutes);


// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
