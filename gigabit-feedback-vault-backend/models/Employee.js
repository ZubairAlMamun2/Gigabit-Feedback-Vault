const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "employee", enum: ["employee", "admin"] },
  },
  { timestamps: true, collection: "employees" }
);

module.exports = mongoose.model("Employee", employeeSchema);
