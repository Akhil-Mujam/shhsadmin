import React, { useMemo, useState, useEffect } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import CommonModal from '../Utils/CommonModal';
import axiosInstance from '../../Common/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [className, setClassName] = useState('10');
  const [classSection, setClassSection] = useState('A');
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filterInput, setFilterInput] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});

  const columnHelper = createColumnHelper();

  const fields = [
    { key: 'regNo', label: 'Reg No' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'fatherName', label: 'Father Name' },
    { key: 'motherName', label: 'Mother Name' },
    { key: 'phno', label: 'Phone No' },
    { key: 'address', label: 'Address' },
    { key: 'password', label: 'Password' },
    { key: 'classesEntity', label: 'Class', disabled: true },
    { key: 'classSection', label: 'Section', disabled: true },
    { key: 'role', label: 'Role', disabled: true },
  ];

  useEffect(() => {
    const initialVisibility = {};
    fields.forEach((field) => {
      initialVisibility[field.key] = true;
    });
    setVisibleColumns(initialVisibility);
  }, []);

  const columns = useMemo(() => {
    const baseColumns = fields
      .filter((field) => visibleColumns[field.key])
      .map((field) =>
        columnHelper.accessor(field.key, {
          header: field.label,
          sortingFn: 'basic',
        })
      );

    baseColumns.push(
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original.regNo)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ),
      })
    );

    return baseColumns;
  }, [fields, visibleColumns]);

  const handleDelete = async (regNo) => {
    if (!window.confirm(`Are you sure you want to delete student with Reg No: ${regNo}?`)) return;
    try {
      const response = await axiosInstance.delete(`/student/delete/${regNo}`);
      toast.success(response.data || 'Student deleted successfully.');
      fetchStudents(currentPage);
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student.');
    }
  };

  const table = useReactTable({
    data: students,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const fetchStudents = async (page) => {
    try {
      const response = await axiosInstance.get(`/student/students/all`, {
        params: {
          className,
          classSection,
          page,
          size,
        },
      });

      setStudents(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch student data.');
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage, className, classSection]);

  const handleFilterChange = (e) => {
    setGlobalFilter(e.target.value);
    setFilterInput(e.target.value);
  };

  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
    setClassSection('A');
    setCurrentPage(0);
  };

  const handleClassSectionChange = (e) => {
    setClassSection(e.target.value);
    setCurrentPage(0);
  };

  const handleEdit = (row) => {
    setModalData({
      ...row,
      studentId: row.studentId,
      classesEntity: className,
      classSection: classSection,
    });
    setModalTitle('Edit Student');
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setModalData({
      classesEntity: className,
      classSection: classSection,
      role: 'Student',
    });
    setModalTitle('Add Student');
    setIsModalVisible(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalData?.studentId) {
        const response = await axiosInstance.put(`/student/update/${modalData.studentId}`, formData);
        toast.success(response.data.message || 'Student updated successfully.');
      } else {
        const response = await axiosInstance.post('/student/add', formData);
        toast.success(response.data.message || 'Student added successfully.');
      }
      setIsModalVisible(false);
      fetchStudents(currentPage);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleToggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const csvHeaders = fields.map((f) => ({ label: f.label, key: f.key }));

  return (
    <div className="p-6 overflow-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Student Details</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          value={filterInput}
          onChange={handleFilterChange}
          placeholder="Search students"
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/4"
        />
        <select
          value={className}
          onChange={handleClassNameChange}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/4"
        >
          {[ 'Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => (i + 1).toString()) ].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={classSection}
          onChange={handleClassSectionChange}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/4"
        >
          {[ 'A', 'B', 'C' ].map((section) => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Add Student
        </button>
        <CSVLink
          data={students}
          headers={csvHeaders}
          filename="students.csv"
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Export CSV
        </CSVLink>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        {fields.map((field) => (
          <label key={field.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visibleColumns[field.key] || false}
              onChange={() => handleToggleColumn(field.key)}
            />
            <span>{field.label}</span>
          </label>
        ))}
      </div>


      <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-blue-500 text-white">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-2 text-left font-semibold cursor-pointer"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted()
                    ? header.column.getIsSorted() === 'asc'
                      ? ' 🔼'
                      : ' 🔽'
                    : ''}
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
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage + 1} of {totalPages} | Total: {students.length} students
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 === totalPages}
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
      />
    </div>
  );
};

export default StudentDetails;
