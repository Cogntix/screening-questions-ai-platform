import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import DashboardNavArrows from "./DashboardNavArrows";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPosition, setNewPosition] = useState("");
  const newItemRef = useRef(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/added-positions`);
      setPositions(res.data);
    } catch (err) {
      setError("Unable to load internship positions.");
    }
  };

  const handleAddPosition = async () => {
    if (!newPosition.trim()) return;

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/added-positions`, {
        positionName: newPosition.trim()
      });
      toast.success("Position added successfully!");
      setNewPosition("");
      setShowModal(false);
      fetchPositions();

      setTimeout(() => {
        if (newItemRef.current) {
          newItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    } catch (err) {
      toast.error("Failed to add position.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Internship Positions</h2>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Position
          </button>
        </div>

        {positions.length === 0 ? (
          <p className="text-gray-600 text-center">No positions found.</p>
        ) : (
          <ul className="space-y-4">
            {positions.map((pos, index) => (
              <li
                key={pos._id}
                ref={index === positions.length - 1 ? newItemRef : null}
                className="p-4 bg-blue-100 border border-blue-200 rounded-md shadow-sm hover:bg-blue-50"
              >
                <div className="text-lg font-semibold text-blue-800">{pos.positionName}</div>
              </li>
            ))}
          </ul>
        )}

        <DashboardNavArrows backTo="/dashboard" />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-blue-700 text-center">Add New Position</h3>
            <input
              type="text"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              placeholder="Enter position name"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPosition}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default ViewPositionsPage;
