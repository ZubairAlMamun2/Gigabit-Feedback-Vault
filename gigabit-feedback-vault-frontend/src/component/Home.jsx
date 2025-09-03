import React, { useContext } from "react";
import Navbar from "./Navbar";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import Footer from "./Footer";


const Home = () => {
    const { user} = useContext(UserContext);
  return (
    <>
    <Navbar />
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-4">
          Welcome to Feedback Vault
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl">
          Empower your team with constructive feedback, improve communication,
          and grow together with real insights.
        </p>
        {
          user?<> </>:<>
          <div className="flex gap-4">
          <Link
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
           to="/auth/login">
            Login
          </Link>
          <Link className="bg-gray-800 border border-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition"
           to="/auth/register">
            Register
          </Link>
        </div></>
        }
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 mx-6 bg-gray-800 rounded-2xl shadow-xl max-w-12/12 ">
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-400 text-center mb-10">
          Why Choose Feedback Vault?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-bold text-purple-300 mb-2">
              ✅ Anonymous Feedback
            </h3>
            <p className="text-gray-400">
              Share honest opinions without fear. Promote transparency and trust
              across your team.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-bold text-purple-300 mb-2">
              📊 Insights & Reports
            </h3>
            <p className="text-gray-400">
              Get data-driven performance summaries to understand strengths and
              areas of improvement.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-bold text-purple-300 mb-2">
              🔒 Secure Access
            </h3>
            <p className="text-gray-400">
              Role-based authentication ensures employees and admins see the
              right information only.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-400 mb-10">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="text-4xl font-bold text-purple-500 mb-3">1️⃣</div>
            <h3 className="text-lg font-semibold mb-2">Register</h3>
            <p className="text-gray-400">
              Create an account as employee or admin to get started.
            </p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-500 mb-3">2️⃣</div>
            <h3 className="text-lg font-semibold mb-2">Give Feedback</h3>
            <p className="text-gray-400">
              Share feedback with your colleagues securely and honestly.
            </p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-500 mb-3">3️⃣</div>
            <h3 className="text-lg font-semibold mb-2">View Insights</h3>
            <p className="text-gray-400">
              See performance summaries and team strengths in real time.
            </p>
          </div>
        </div>
      </section>
    </div>
    <Footer /> 
    </>
  );
};

export default Home;


