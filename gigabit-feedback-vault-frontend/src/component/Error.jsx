import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-center px-6">
      {/* Big 404 */}
      <h1 className="text-8xl font-bold text-purple-500 mb-4">404</h1>

      {/* Message */}
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-md transition"
        >
          Go Home
        </Link>
        <Link
          to="/auth/login"
          className="border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-medium py-2 px-6 rounded-md transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Error;
