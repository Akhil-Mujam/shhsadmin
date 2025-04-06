import React, { useState, useEffect } from "react";
import axiosInstance from "../../Common/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClassFees = () => {
  const [feesData, setFeesData] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    term1Fee: "",
    term2Fee: "",
    term3Fee: "",
  });

  useEffect(() => {
    // Fetch initial data
    axiosInstance
      .get("/api/class-fees/all")
      .then((response) => {
        setFeesData(response.data);
      })
      .catch((error) => toast.error("Error fetching data"));
  }, []);

  const handleEdit = (className, term1Fee, term2Fee, term3Fee) => {
    setEditingClass(className);
    setFormData({ term1Fee, term2Fee, term3Fee });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    axiosInstance
      .put(`/api/class-fees/${editingClass}/update-fees`, null, {
        params: formData,
      })
      .then((response) => {
        setFeesData((prevData) =>
          prevData.map((item) =>
            item.className === editingClass
              ? { ...item, ...formData, totalFee: response.data.totalFee }
              : item
          )
        );
        setEditingClass(null); // Exit editing mode
        toast.success("Fees updated successfully!");
      })
      .catch((error) => toast.error("Error updating fees"));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Class Fees Management
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {feesData.map((fee) => (
          <div
            key={fee.id}
            className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              Class: {fee.className}
            </h2>
            <p className="text-gray-700">
              <strong>Term 1 Fee:</strong> ₹{fee.term1Fee}
            </p>
            <p className="text-gray-700">
              <strong>Term 2 Fee:</strong> ₹{fee.term2Fee}
            </p>
            <p className="text-gray-700">
              <strong>Term 3 Fee:</strong> ₹{fee.term3Fee}
            </p>
            <p className="text-gray-900 font-bold">
              <strong>Total Fee:</strong> ₹{fee.totalFee}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
              onClick={() =>
                handleEdit(fee.className, fee.term1Fee, fee.term2Fee, fee.term3Fee)
              }
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {editingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md border border-gray-300">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
              Edit Fees for Class {editingClass}
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block font-medium text-gray-700">
                  Term 1 Fee:
                </label>
                <input
                  type="number"
                  name="term1Fee"
                  value={formData.term1Fee}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  Term 2 Fee:
                </label>
                <input
                  type="number"
                  name="term2Fee"
                  value={formData.term2Fee}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  Term 3 Fee:
                </label>
                <input
                  type="number"
                  name="term3Fee"
                  value={formData.term3Fee}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => setEditingClass(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassFees;
