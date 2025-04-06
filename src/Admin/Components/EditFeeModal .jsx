import React, { useState } from "react";

const EditFeeModal = ({ feeDetails, onClose, onSubmit }) => {
  const [updatedDetails, setUpdatedDetails] = useState(
    ["1st Term", "2nd Term", "3rd Term"].map((term) => ({
      termName: term,
      feeId: feeDetails[term]?.feeDetailId,
      isPaid: feeDetails[term]?.paidDate !== "N/A",
      paidDate: feeDetails[term]?.paidDate || "",
    }))
  );

  const [discount, setDiscount] = useState(feeDetails.Discount || 0);

  const handleInputChange = (index, field, value) => {
    const updated = [...updatedDetails];
    updated[index][field] = value;
    setUpdatedDetails(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Edit Fee Details</h2>
        <table className="min-w-full bg-white border border-gray-300 shadow-lg mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Term Name</th>
              <th className="px-4 py-2 text-left">Paid Date</th>
              <th className="px-4 py-2 text-left">Is Paid?</th>
            </tr>
          </thead>
          <tbody>
            {updatedDetails.map((term, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{term.termName}</td>
                <td className="px-4 py-2">
                  <input
                    type="date"
                    value={term.paidDate}
                    onChange={(e) =>
                      handleInputChange(index, "paidDate", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={term.isPaid}
                    onChange={(e) =>
                      handleInputChange(index, "isPaid", e.target.checked)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center mb-4">
          <label htmlFor="discount" className="mr-2">
            Discount:
          </label>
          <input
            id="discount"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-1/4"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ updatedDetails, discount })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFeeModal;
