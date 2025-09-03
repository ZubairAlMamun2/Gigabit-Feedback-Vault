const express = require("express");
const authMiddleware = require("../middleware/auth");
const Employee = require("../models/Employee");

const router = express.Router();

// Get all employees except admins
router.get("/", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find({ role: { $ne: "admin" } });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

module.exports = router;
