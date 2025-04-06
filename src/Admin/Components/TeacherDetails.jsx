import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Common/axios';
import TeacherTable from '../Utils/TeacherTable';

const fields = [
  { key: 'regNo', label: 'Employee ID' }, // FIXED: Matching sampleTeachers structure
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'password', label: 'Password' },
  { key: 'address', label: 'Address' },
  { key: 'phno', label: 'Phone' },
  { key: 'role', label: 'Role', disabled: true }, // Default role
];

const TeacherDetails = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageSize] = useState(10);

  const fetchTeachers = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/teacher/all', {
        params: { page, size: pageSize },
      });
      const { content, totalPages } = response.data;
      setTeachers(content);
      setTotalPages(totalPages);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teacher data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teacher Details</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <TeacherTable
            data={teachers}
            fields={fields}
            title="Teacher"
            isStudent={false}
            refreshData={fetchTeachers} // ✅ FIXED: Ensures auto refresh
          />

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDetails;
