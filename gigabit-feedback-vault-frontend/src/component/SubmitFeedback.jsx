import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";
import { Loader2 } from "lucide-react";
import Navbar from "./Navbar";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SubmitFeedback = () => {
  const { user, token,logout } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate=useNavigate()
  const [form, setForm] = useState({
    communication: 0,
    skill: 0,
    initiative: 0,
    comment: "",
  });

  useEffect(() => {
    if (!token || !user?.email) return;

    setLoading(true);
    axios
      .get("http://localhost:5000/allemployee", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const filtered = res.data.filter((u) => u.email !== user?.email);
        setUsers(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.error || "Failed to load users",
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  }, [token, user?.email]);

  // Handle submit feedback
  const handleSubmit = async () => {
    if (
      !form.communication ||
      !form.skill ||
      !form.initiative ||
      !form.comment
    ) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }
    console.log({
          submitedByEmail: user?.email,
          submitedToEmail: selectedUser.email,
          submitedByName: user?.name,
          submitedToName: selectedUser.name,
          communication: form.communication,
          skill: form.skill,
          initiative: form.initiative,
          comment: form.comment,
        })

    try {
      await axios.post(
        "http://localhost:5000/submit-feedback",
        {
          submitedByEmail: user?.email,
          submitedToEmail: selectedUser.email,
          submitedByName: user?.name,
          submitedToName: selectedUser.name,
          communication: form.communication,
          skill: form.skill,
          initiative: form.initiative,
          comment: form.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", "Feedback submitted successfully!", "success");
      setSelectedUser(null); // close modal
      setForm({ communication: 0, skill: 0, initiative: 0, comment: "" });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Failed to submit feedback",
        "error"
      );
      if(err.response?.data?.error=="Invalid token"){
          logout();
          navigate('/');
        }
      setSelectedUser(null); // close modal
      setForm({ communication: 0, skill: 0, initiative: 0, comment: "" });
    }
  };

  // Reusable Star Rating Component
  const StarRating = ({ field }) => (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`cursor-pointer ${
            form[field] >= star ? "text-yellow-400" : "text-gray-400"
          }`}
          onClick={() => setForm({ ...form, [field]: star })}
        />
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="flex justify-center min-h-screen items-center h-40">
          <Loader2 className="animate-spin text-purple-400" size={50} />
        </div>
      ) : (
        <div className="grid gap-6 px-4 my-6 md:px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-h-[60vh]">
          {users.map((user) => (
            <div
              key={user._id}
              className="relative group bg-gray-800 text-white shadow-xl rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="card-body relative p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg font-bold mb-4">
                  {user.name.charAt(0)}
                </div>

                <h2 className="text-purple-400 text-lg font-semibold text-center mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  {user.email}
                </p>

                <button
                  onClick={() => setSelectedUser(user)}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg text-white relative">
            <h2 className="text-xl font-semibold text-purple-400 mb-4 text-center">
              Feedback for {selectedUser.name}
            </h2>

            <div className="space-y-4">
              <div>
                <p>Professional Communication:</p>
                <StarRating field="communication" />
              </div>

              <div>
                <p>Skill Development:</p>
                <StarRating field="skill" />
              </div>

              <div>
                <p>Initiative & Ownership:</p>
                <StarRating field="initiative" />
              </div>

              <div>
                <p>Comment:</p>
                <textarea
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
                  rows="3"
                  placeholder="Write your feedback..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitFeedback;
