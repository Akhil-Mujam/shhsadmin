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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonModal from './CommonModal';
import axiosInstance from '../../Common/axios';

const TeacherTable = ({ data, fields, refreshData }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState(null);
  const [classTeacherDetails, setClassTeacherDetails] = useState({
    className: '',
    classSection: '',
  });
  const [isClassTeacherModalVisible, setIsClassTeacherModalVisible] = useState(false);
  const [classTeacherAction, setClassTeacherAction] = useState('');

  const columnHelper = createColumnHelper();

  const getClassSections = (className) => {
    if (['Nursery', 'LKG', 'UKG'].includes(className)) return ['A'];
    if (parseInt(className) >= 1 && parseInt(className) <= 5) return ['A', 'B', 'C'];
    if (parseInt(className) >= 6 && parseInt(className) <= 10) return ['A', 'B'];
    return [];
  };

  const columns = useMemo(() => {
    const baseColumns = fields.map((field) =>
      columnHelper.accessor(field.key, {
        header: field.label,
      })
    );

    baseColumns.push(
      columnHelper.display({
        id: 'classTeacher',
        header: 'Class Teacher',
        cell: ({ row }) => {
          const { regNo } = row.original;
          return (
            <button
              onClick={() => handleClassTeacherAction(regNo)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Check Class Teacher Status
            </button>
          );
        },
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
  }, [fields]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (row) => {
    setModalData(row);
    setModalTitle('Edit Teacher');
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setModalData({ role: 'Teacher' }); // Set default role to "Teacher"
    setModalTitle('Add Teacher');
    setIsModalVisible(true);
  };

  const handleDelete = async (regNo) => {
    try {
      const response = await axiosInstance.delete(`/teacher/delete/${regNo}`);
      toast.success(response.data);
      refreshData();
    } catch (error) {
      if(error.response)
      {
      toast.error(error.response?.data || 'Failed to delete teacher.');
      }
    }
  };

  const handleClassTeacherAction = async (regNo) => {
    try {
      const response = await axiosInstance.get(`/teacher/class-details/${regNo}`);
      console.log(response.data)
      console.log('remove')
      setClassTeacherDetails(response.data);
      setClassTeacherAction('remove');
      setModalData({ regNo });  // Ensure regNo is set in modalData
      setIsClassTeacherModalVisible(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setClassTeacherAction('assign');
        setModalData({ regNo });
        setIsClassTeacherModalVisible(true);
      } else {
        if(error.response)
        {
        toast.error(error.response?.data || 'Error checking class teacher status.');
        }
      }
    }
  };

  const handleClassTeacherSubmit = async () => {
    const { regNo } = modalData;
    console.log('regNo= '+regNo)
    console.log(classTeacherAction);
    try {
      if (classTeacherAction === 'assign') {
        const { regNo } = modalData;
        const { className, classSection } = classTeacherDetails;
        const response = await axiosInstance.post('/teacher/assign', null, {
          params: { regNo, classEntity: className, classSection },
        });
        console.log(response.data + " response data after assign")
        toast.success(response.data);
      } else  {
        console.log('inside else loop of remove')
        // const { regNo } = modalData;
        // console.log('regNo= '+regNo)
        const response = await axiosInstance.delete(`/teacher/remove-classTeacher/${regNo}`);
        console.log(response.data)
        toast.success(response.data);
      }
      setIsClassTeacherModalVisible(false);
      refreshData();
    } catch (error) {
      if(error.response)
      {
      toast.error(error.response?.data || 'Failed to update class teacher status.');
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      // Ensure role is set to "Teacher" for new additions
      if (!formData.role) formData.role = 'Teacher';

      let response;
      if (modalData && modalData.teacherId) {
        // Updating an existing teacher
        response = await axiosInstance.put(`/teacher/update/${modalData.teacherId}`, formData);
      } else {
        // Adding a new teacher
        response = await axiosInstance.post('/teacher/add', formData);
      }

      toast.success(response.data || 'Operation successful.');
      setIsModalVisible(false);
      refreshData();
    } catch (error) {
      if(error.response)
      {
       toast.error(error.response?.data || 'Operation failed.');
      }
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
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Add Teacher
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

      <CommonModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleModalSubmit}
        fields={fields}
        title={modalTitle}
        initialData={modalData}
      />

      {isClassTeacherModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {classTeacherAction === 'assign' ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Assign as Class Teacher</h2>
                <select
                  value={classTeacherDetails.className}
                  onChange={(e) => setClassTeacherDetails({ ...classTeacherDetails, className: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg w-full mb-2"
                >
                  <option value="">Select Class</option>
                  {['Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `${i + 1}`)].map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
                <select
                  value={classTeacherDetails.classSection}
                  onChange={(e) => setClassTeacherDetails({ ...classTeacherDetails, classSection: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg w-full mb-4"
                >
                  <option value="">Select Section</option>
                  {getClassSections(classTeacherDetails.className).map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
               <h2 className="text-2xl font-semibold text-gray-800 mb-6">Remove as Class Teacher</h2>
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Class:</span>
                  <span className="text-2xl font-semibold text-gray-800">{classTeacherDetails.className}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Section:</span>
                  <span className="text-2xl font-semibold text-gray-800">{classTeacherDetails.classSection}</span>
                </div>
              </div>

              </>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClassTeacherSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {classTeacherAction === 'assign' ? 'Assign' : 'Remove'}
              </button>
              <button
                onClick={() => setIsClassTeacherModalVisible(false)}
                className="ml-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTable;
