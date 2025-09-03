import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";
import { Loader2, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const AdminPanel = () => {
  const { token, user, logout } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  Load all feedback
  useEffect(() => {
    if (!token || user?.role !== "admin") {
      
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:5000/admin/feedbacks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFeedbacks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire(
          "Error",
          err.response?.data?.error || "Failed to load feedbacks",
          "error"
        );
        if (err.response?.data?.error == "Invalid token") {
          logout();
          navigate("/");
        }
      });
  }, [token, user?.email]);

  //  Load summary data
  useEffect(() => {
    if (!token || user?.role !== "admin") return;

    axios
      .get("http://localhost:5000/admin/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token, user]);

  const chartData = [
    { category: "Communication", rating: summary[0]?.avgCommunication.toFixed(2) },
    { category: "Skill", rating: summary[0]?.avgSkill.toFixed(2) },
    { category: "Initiative", rating: summary[0]?.avgInitiative.toFixed(2) },
  ];

  //  Export CSV
  const handleExport = () => {
    axios
      .get("http://localhost:5000/admin/export-feedback", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "feedbacks.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => {
        Swal.fire("Error", "Failed to export CSV", "error");
      });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold text-purple-400 mb-6">Admin Panel</h1>

        {/* Export Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleExport}
            className="flex items-center bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition duration-300"
          >
            <Download className="mr-2" size={18} /> Export CSV
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-purple-400" size={50} />
          </div>
        ) : (
          <>
            {/* All Feedbacks */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-purple-400 mb-4">
                All Feedback
              </h2>
              {feedbacks.length === 0 ? (
                <p>No feedback submitted yet.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {feedbacks.map((fb, i) => (
                    <div
                      key={i}
                      className="bg-gray-800 p-4 rounded-lg shadow-lg"
                    >
                      <div className="text-sm text-gray-400 mb-2">
                        <p>
                          <span className="text-purple-400">From:</span>{" "}
                          {fb.submitedByName}
                        </p>
                        <p>
                          <span className="text-purple-400">To:</span>{" "}
                          {fb.submitedToName}
                        </p>
                      </div>
                      <p className="mb-2 text-gray-300 italic">
                        "{fb.comment}"
                      </p>

                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Comm: {fb.communication}</span>
                        <span>Skill: {fb.skill}</span>
                        <span>Initiative: {fb.initiative}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div>
              <h2 className="text-xl font-semibold text-purple-400 mb-4">
                Team Strengths & Weaknesses
              </h2>
              {summary?.length === 0 ? (
                <p>No summary data available.</p>
              ) : (
                <>
                  {/* Determine Strength and Weakness */}
                  {(() => {
                    const { avgCommunication, avgSkill, avgInitiative } =
                      summary[0];
                    const metrics = [
                      { name: "Communication", value: avgCommunication },
                      { name: "Skill", value: avgSkill },
                      { name: "Initiative", value: avgInitiative },
                    ];
                    const sorted = [...metrics].sort(
                      (a, b) => b.value - a.value
                    );
                    const strength = sorted[0].name;
                    const weakness = sorted[sorted.length - 1].name;
                    return (
                      <div className="mb-2">
                        <p className="text-green-400">
                          Team Strength: {strength}
                        </p>
                        <p className="text-red-400">
                          Team Weakness: {weakness}
                        </p>
                      </div>
                    );
                  })()}

                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" stroke="#c084fc" />
                      <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rating" fill="#a78bfa" />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminPanel;
