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

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [className, setClassName] = useState('X');
  const [classSection, setClassSection] = useState('A');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filterInput, setFilterInput] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState(null);

  const columnHelper = createColumnHelper();
  const fields = [
    { key: 'regNo', label: 'Reg No' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'fatherName', label: 'Father Name' },
    { key: 'motherName', label: 'Mother Name' },
    { key: 'phno', label: 'Phone No' },
    { key: 'address', label: 'Address' },
    { key: 'password', label: 'password' },
    { key: 'classesEntity', label: 'Class', disabled: true }, // Non-editable
    { key: 'classSection', label: 'Section', disabled: true }, // Non-editable
    { key: 'role', label: 'Role', disabled: true }, // Default role
  ];

  const columns = useMemo(() => {
    const baseColumns = fields.map((field) =>
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
          <button
            onClick={() => handleEdit(row.original)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Edit
          </button>
        ),
      })
    );

    return baseColumns;
  }, [fields]);

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

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get(
        `/student/pagination/getClassStudents/${className}/${classSection}`,
        { params: { page, size } }
      );
      setStudents(response.data || []);
      console.log(students)
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch student data.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, className, classSection]);

  const handleFilterChange = (e) => {
    setGlobalFilter(e.target.value);
    setFilterInput(e.target.value);
  };

  const handleClassNameChange = (e) => {
    const selectedClassName = e.target.value;
    setClassName(selectedClassName);
    setClassSection('A'); // Default to "A" for any selected class
  };

  const handleClassSectionChange = (e) => {
    setClassSection(e.target.value);
  };

  const handleEdit = (row) => {
    setModalData({
      ...row,
      studentId: row.studentId, // Include studentId for updating
      classesEntity: className, // Default className
      classSection: classSection, // Default classSection
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
      if (modalData && modalData.studentId) {
        // Update the student record
        const response = await axiosInstance.put(`/student/update/${modalData.studentId}`, formData);
        toast.success(response.data.message || 'Student updated successfully.');
      } else {
        // Add a new student
        const response = await axiosInstance.post('/student/add', formData);
        toast.success(response.data.message || 'Student added successfully.');
      }
      setIsModalVisible(false);
      fetchStudents();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form.');
    }
  };
  

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Student Details</h2>

      <div className="flex gap-4 mb-4">
        <input
          value={filterInput}
          onChange={handleFilterChange}
          placeholder="Search students"
          className="p-2 border border-gray-300 rounded-lg w-1/4"
        />
        <select
          value={className}
          onChange={handleClassNameChange}
          className="p-2 border border-gray-300 rounded-lg w-1/4"
        >
          {['Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => (i + 1).toString())].map(
            (option) => (
              <option key={option} value={option}>
                {option}
              </option>
            )
          )}
        </select>
        <select
          value={classSection}
          onChange={handleClassSectionChange}
          className="p-2 border border-gray-300 rounded-lg w-1/4"
        >
          {['A', 'B', 'C'].map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
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
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-2 text-left font-semibold cursor-pointer"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
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

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
        >
          Previous
        </button>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
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
      />
    </div>
  );
};

export default StudentDetails;
