import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavArrows from "./DashboardNavArrows";
import { Trash2 } from "lucide-react"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ViewInternsPage = () => {
  const [interns, setInterns] = useState([]);
  const [error, setError] = useState("");
  
  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/candidates`);
      setInterns(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load interns.");
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy.");
    } 
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/candidates/${id}`);
      toast.success("Candidate deleted successfully.");
      fetchInterns();
    } catch (err) {
      toast.error("Failed to delete candidate.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200">
        <h2 className="text-3xl font-bold text-blue-800 mb-2 text-center">Registered Interns</h2>
        <p className="text-blue-600 mb-6 text-center">View and manage candidate details</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center border border-red-300">
            {error}
          </div>
        )}

        {interns.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border-2 border-blue-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-100 text-left text-blue-800">
                  <th className="p-4 border-b-2 border-blue-200">#</th>
                  <th className="p-4 border-b-2 border-blue-200">Full Name</th>
                  <th className="p-4 border-b-2 border-blue-200">Position</th>
                  <th className="p-4 border-b-2 border-blue-200 text-center">Submitted</th>
                  <th className="p-4 border-b-2 border-blue-200">Test Link</th>
                  <th className="p-4 border-b-2 border-blue-200">Copy Link</th>
                  <th className="p-4 border-b-2 border-blue-200">Password</th>
                  <th className="p-4 border-b-2 border-blue-200 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern, index) => {
                  const testLink = `https://screening.cogntix.com/test/${intern.token}`;
                  return (
                    <tr key={intern._id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 border-b border-blue-100">{index + 1}</td>
                      <td className="p-4 border-b border-blue-100 font-medium">{intern.fullName}</td>
                      <td className="p-4 border-b border-blue-100">{intern.positionId?.positionName || "-"}</td>
                      <td className="p-4 border-b border-blue-100 text-center">
                        {intern.hasSubmitted ? 
                          <FaCheckCircle className="text-green-600 inline-block text-xl" /> : 
                          <FaTimesCircle className="text-red-600 inline-block text-xl" />
                        }
                      </td>
                      <td className="p-4 border-b border-blue-100">
                        <a 
                          href={testLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Open Test
                        </a>
                      </td>
                      <td className="p-4 border-b border-blue-100">
                        <button
                          onClick={() => copyToClipboard(testLink)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          📋 Copy
                        </button>
                      </td>
                      <td className="p-4 border-b border-blue-100">
                        <button
                          onClick={() => copyToClipboard(intern.plaintextPassword || "N/A")}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          📋 Copy
                        </button>
                      </td>
                      <td className="p-4 border-b border-blue-100 text-center">
                        <button
                          onClick={() => handleDelete(intern._id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-100"
                          title="Delete Candidate"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
            <p className="text-blue-700">No interns found. Add candidates to get started.</p>
          </div>
        )}
        
        <DashboardNavArrows backTo="/dashboard" />
      </div>

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

export default ViewInternsPage;