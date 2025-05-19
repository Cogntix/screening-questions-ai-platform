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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200">
        <h2 className="text-3xl font-bold text-blue-800 mb-2 text-center">Internship Positions</h2>
        <p className="text-blue-600 text-center mb-6">Manage available internship roles</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center border border-red-300">
            {error}
          </div>
        )}

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            + Add New Position
          </button>
        </div>

        {positions.length === 0 ? (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
            <p className="text-blue-700">No positions found. Add your first position!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {positions.map((pos, index) => (
              <li
                key={pos._id}
                ref={index === positions.length - 1 ? newItemRef : null}
                className="p-5 bg-blue-100 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
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
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border-2 border-blue-200">
            <h3 className="text-2xl font-bold mb-4 text-blue-800 text-center">Add New Position</h3>
            <input
              type="text"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              placeholder="Enter position name"
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 mb-6"
              autoFocus
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPosition}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                Add Position
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        hideProgressBar
        toastClassName="bg-blue-100 border-2 border-blue-200 text-blue-800"
        progressClassName="bg-blue-400"
      />
    </div>
  );
};

export default ViewPositionsPage;