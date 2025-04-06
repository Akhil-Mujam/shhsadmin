import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../Common/axios";
import EditFeeModal from "./EditFeeModal ";

const FeeDetails = () => {
  const [feeData, setFeeData] = useState([]);
  const [className, setClassName] = useState("10");
  const [classSection, setClassSection] = useState("A");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeeDetails, setSelectedFeeDetails] = useState(null);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("Name", {
        header: "Student Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("1st Term", {
        header: "1st Term Fee",
        cell: (info) => `₹${info.getValue()?.amount ?? 0}`, // Fallback to 0 if undefined
      }),
      columnHelper.accessor("1st Term.paidDate", {
        header: "1st Term Paid Date",
        cell: (info) => info.getValue() || "Not Paid", // Default to "Not Paid"
      }),
      columnHelper.accessor("2nd Term", {
        header: "2nd Term Fee",
        cell: (info) => `₹${info.getValue()?.amount ?? 0}`,
      }),
      columnHelper.accessor("2nd Term.paidDate", {
        header: "2nd Term Paid Date",
        cell: (info) => info.getValue() || "Not Paid",
      }),
      columnHelper.accessor("3rd Term", {
        header: "3rd Term Fee",
        cell: (info) => `₹${info.getValue()?.amount ?? 0}`,
      }),
      columnHelper.accessor("3rd Term.paidDate", {
        header: "3rd Term Paid Date",
        cell: (info) => info.getValue() || "Not Paid",
      }),
      columnHelper.accessor("Total Fee", {
        header: "Total Fee",
        cell: (info) => `₹${info.getValue() ?? 0}`, // Fallback to 0
      }),
      columnHelper.accessor("Fee After Discount", {
        header: "Fee After Discount",
        cell: (info) => `₹${info.getValue() ?? 0}`,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => handleEdit(row.original)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Edit Fee Details
          </button>
        ),
      }),
    ],
    []
  );
  

  const table = useReactTable({
    data: feeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const fetchFeeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/fee-details/class/${className}/section/${classSection}`
      );
      setFeeData(response.data);
    } catch (error) {
      console.error("Error fetching fee details:", error);
      toast.error("Failed to fetch fee details.");
    }
  };

  useEffect(() => {
    fetchFeeDetails();
  }, [className, classSection]);

  const handleEdit = (feeDetails) => {
    setSelectedFeeDetails(feeDetails);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedFeeDetails(null);
    setIsModalVisible(false);
  };

  const handleUpdate = async (updatedDetails) => {
    const { updatedDetails: termUpdates, discount } = updatedDetails;

    // Validation for discount
    if (discount < 0 || !Number.isInteger(Number(discount))) {
      toast.error("Discount must be a non-negative integer.");
      return;
    }

    try {
      // Update payment details for each term
      for (const term of termUpdates) {
        const { feeId, isPaid, paidDate } = term;
        console.log(paidDate)
        if(paidDate != null && paidDate != "N/A")
        {
            await axiosInstance.put(
            `/api/fee-details/update-payment/${feeId}`,
            {},
            {
                params: {
                isPaid,
                paidDate,
                },
            }
            );
        }
      }

      // Update discount
      await axiosInstance.patch(`/student/update-discount`, {
        studentId: selectedFeeDetails["Student Id"],
        discount,
      });

      toast.success("Fee details updated successfully.");
      handleModalClose();
      fetchFeeDetails();
    } catch (error) {
      console.error("Error updating fee details:", error);
      toast.error("Failed to update fee details.");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Fee Details</h2>

      <div className="flex gap-4 mb-4">
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/4"
        >
          {["Nursery", "LKG", "UKG", ...Array.from({ length: 10 }, (_, i) => (i + 1).toString())].map(
            (option) => (
              <option key={option} value={option}>
                {option}
              </option>
            )
          )}
        </select>
        <select
          value={classSection}
          onChange={(e) => setClassSection(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/4"
        >
          {["A", "B", "C"].map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-blue-500 text-white">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-blue-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && (
        <EditFeeModal
          feeDetails={selectedFeeDetails}
          onClose={handleModalClose}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default FeeDetails;
