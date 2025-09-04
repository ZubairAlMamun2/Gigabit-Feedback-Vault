const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Global rate limit (all requests)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});


// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173" ,"https://gigabit-feedback-vault-2025.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(apiLimiter);

// Connect MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Feedback Vault server is running");
});

app.listen(PORT, () => {
  // console.log(`Server running at http://localhost:${PORT}`);
});
