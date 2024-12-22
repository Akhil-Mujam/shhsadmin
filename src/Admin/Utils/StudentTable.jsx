import React, { useMemo, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import CommonModal from "./CommonModal";
import axiosInstance from "../../Common/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentTable = ({ data, fields, onPageChange, page, totalPages, fetchStudents }) => {
  const columnHelper = createColumnHelper();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [availableSections, setAvailableSections] = useState([]);

  const getClassSections = (className) => {
    if (className === "Nursery" || className === "LKG" || className === "UKG") {
      return ["A"];
    } else if (parseInt(className) >= 1 && parseInt(className) <= 5) {
      return ["A", "B", "C"];
    } else if (parseInt(className) >= 6 && parseInt(className) <= 10) {
      return ["A", "B"];
    }
    return [];
  };

  const columns = fields.map((field) =>
    columnHelper.accessor(field.key, { header: field.label })
  );

  columns.push(
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleEdit(row.original)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Edit
        </button>
      ),
    })
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (student) => {
    setModalData(student);
    setModalTitle("Edit Student");
    setAvailableSections(getClassSections(student?.className || ""));
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setModalData(null);
    setModalTitle("Add Student");
    setAvailableSections([]);
    setIsModalVisible(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalData) {
        await axiosInstance.put(`/student/update/${modalData.regNo}`, formData);
        toast.success("Student updated successfully.");
      } else {
        await axiosInstance.post(`/student/add`, formData);
        toast.success("Student added successfully.");
      }
      setIsModalVisible(false);
      fetchStudents();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="p-2 border border-gray-300 rounded-lg w-1/4"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Add Student
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-blue-500 text-white">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left">
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
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
        >
          Next
        </button>
      </div>

      <CommonModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleModalSubmit}
        fields={fields}
        title={modalTitle}
        initialData={modalData}
        defaultRole="Student"
        dropdownOptions={{
          role: ["Student", "Teacher", "Admin"],
          className: ["Nursery", "LKG", "UKG", ...Array.from({ length: 10 }, (_, i) => (i + 1).toString())],
          classSection: availableSections,
        }}
      />
    </div>
  );
};

export default StudentTable;
