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
      fetchInterns(); // refresh list
    } catch (err) {
      toast.error("Failed to delete candidate.");
    }
  };
  

  
  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Registered Interns</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {interns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300 text-sm">
              <thead>
                <tr className="bg-blue-100 text-left text-sm text-gray-700">
                  <th className="p-3 border"></th>
                  <th className="p-3 border">Full Name</th>
                  <th className="p-3 border">Position</th>
                  <th className="p-3 border">Submitted</th>
                  <th className="p-3 border">Test Link</th>
                  <th className="p-3 border">Copy Link</th>
                  <th className="p-3 border">Password</th>
                  <th className="p-3 border">Delete</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern, index) => {
                  const testLink = `https://screening.cogntix.com/test/${intern.token}`;
                  return (
                    <tr key={intern._id} className="hover:bg-gray-50">
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">{intern.fullName}</td>
                      <td className="p-3 border">{intern.positionId?.positionName || "-"}</td>
                      <td className="p-3 border text-center align-middle ">{intern.hasSubmitted ? <FaCheckCircle className="text-green-600 inline-block"/> : <FaTimesCircle className="text-red-600 inline-block" />}</td>
                      <td className="p-3 border text-xs text-blue-600 underline">
                        <a href={testLink} target="_blank" rel="noopener noreferrer">
                          Visit Test
                        </a>
                      </td>
                      <td className="p-2 border">
                        <button
                          onClick={() => copyToClipboard(testLink)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Copy Link
                        </button>
                      </td>
                      <td className="p-2 border">
                        <button
                          onClick={() => copyToClipboard(intern.plaintextPassword || "N/A")}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Copy Password
                        </button>
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          onClick={() => handleDelete(intern._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Candidate"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No interns found.</p>
        )}
         <DashboardNavArrows backTo="/dashboard" />
      </div>

     
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

    </div>
  );
};

export default ViewInternsPage;
