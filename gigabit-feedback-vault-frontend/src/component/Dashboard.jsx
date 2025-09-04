import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Loading from "./Loading";

const Dashboard = () => {
  const { user, token, logout, loading, setLoading } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  //Load my feedbacks
  useEffect(() => {
    if (!token || !user?.email) return;

    if (user.role === "admin") {
      navigate("/adminpanel");
      return;
    }

    setLoading(true);
    axios
      .get("https://gigabit-feedback-vault-backend.vercel.app/feedback/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFeedbacks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire({
          title: "Error",
          text: err.response?.data?.error || "Failed to load feedback",
          icon: "error",
        });
        if (err.response?.data?.error == "Invalid token") {
          logout();
          navigate("/");
        }
      });
  }, [token, user?.email]);

  // Compute average ratings
  const average = { communication: 0, skill: 0, initiative: 0 };
  if (feedbacks.length > 0) {
    feedbacks.forEach((fb) => {
      average.communication += fb.communication;
      average.skill += fb.skill;
      average.initiative += fb.initiative;
    });
    average.communication /= feedbacks.length;
    average.skill /= feedbacks.length;
    average.initiative /= feedbacks.length;
  }

  const chartData = [
    { category: "Communication", rating: average.communication.toFixed(2) },
    { category: "Skill", rating: average.skill.toFixed(2) },
    { category: "Initiative", rating: average.initiative.toFixed(2) },
  ];
  return (
    <>
      <Navbar />
      <div className="p-6 min-h-screen">
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* List of all individual feedbacks */}
            <div>
              <h2 className="text-xl font-semibold text-purple-500 mb-4">
                Feedback Summary
              </h2>

              {feedbacks.length === 0 ? (
                <p>No feedback received yet.</p>
              ) : (
                <>
                  {/* Average Ratings */}
                  <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-purple-500 mb-2">
                      Average Ratings
                    </h3>
                    <div className="flex justify-between text-sm text-gray-200">
                      <span>
                        Communication: {average.communication.toFixed(1)}
                      </span>
                      <span>Skill: {average.skill.toFixed(1)}</span>
                      <span>Initiative: {average.initiative.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Received Comments */}
                  <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-purple-500 mb-2">
                      Received Comments
                    </h3>
                    {feedbacks.map((fb, i) => (
                      <div key={i} className="bg-gray-800 py-4 rounded-lg mb-3">
                        {/* Comment */}
                        <p className="text-gray-200 mb-2">
                          -{fb.comment || "No comment provided"}
                        </p>

                        {/* Sentiment */}
                        <div className="text-sm text-gray-200 font-semibold">
                          Sentiment:{" "}
                          <span
                            className={`${
                              fb.sentiment === "Positive"
                                ? "text-green-400"
                                : fb.sentiment === "Negative"
                                ? "text-red-400"
                                : "text-yellow-300"
                            }`}
                          >
                            {fb.sentiment || "Neutral"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Summary Bar Chart */}
            <h2 className="text-xl font-semibold text-purple-500 mb-4 mt-12">
              Bar Chart
            </h2>
            <div className="mb-8 w-full h-64 ">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
