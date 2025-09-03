import React, { useContext, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [error, setError] = useState("");
  const [passtype, setPasstype] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    axios
      .post("http://localhost:5000/auth/login", { email, password })
      .then((res) => {
        const { user, token } = res.data;
        if (res.data) {
          Swal.fire({
            title: "Success!",
            text: "User LogedIn successfully",
            icon: "success",
            confirmButtonText: "Cool",
          });
          navigate("/");
        }

        // Calculate expiry time (1 hour from now)
        const expiry = new Date().getTime() + 60 * 60 * 1000;

        // Store user, token, and expiry in localStorage
        localStorage.setItem(
          "userdata",
          JSON.stringify({ user, token, expiry })
        );

        setUser(user); // set in context
        setToken(token); // set in context
      })
      .catch((err) => {
        setError(err.message);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong",
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 px-4">
      <div className="bg-gray-800 w-full max-w-md rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-purple-400 mb-6">
          Login your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            Login
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm mt-6">
          Dont’t Have An Account ?{" "}
          <Link className="text-purple-400 hover:underline" to="/auth/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
