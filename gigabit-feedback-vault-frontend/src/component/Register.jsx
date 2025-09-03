import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const [error, setError] = useState("");
  const [passtype, setPasstype] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const name = form.get("name");
    const role = "Employee";
    const email = form.get("email");
    const password = form.get("password");

    const user = { name, role, email, password };

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Must have an Uppercase letter,a Lowercase letter and must be at least 6 character"
      );
      return;
    }

    console.log(user);

    axios
      .post("http://localhost:5000/createnewuser", user)
      .then((res) => {
        if (res.data.acknowledged) {
          Swal.fire({
            title: "Success!",
            text: "User added successfully",
            icon: "success",
            confirmButtonText: "Cool",
          });
          navigate("/auth/login");
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire(
                "Error",
                err.response?.data?.error || "Failed to create New User",
                "error"
              );
      });
  }; 

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 px-4">
      <div className="bg-gray-800 w-full max-w-md rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-purple-400 mb-6">
          Register your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 text-gray-300">Your Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 text-gray-300">Password</label>
            <input
              name="password"
              type={passtype ? "text" : "password"}
              placeholder="Enter your password"
              className="input input-bordered w-full rounded-md px-3 py-2 pr-10"
              required
            />
            <span
              onClick={() => setPasstype(!passtype)}
              className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-white"
            >
              {passtype ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 rounded-md transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm mt-6">
          Already have an account?{" "}
          <Link className="text-purple-400 hover:underline" to="/auth/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
