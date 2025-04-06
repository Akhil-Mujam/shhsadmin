import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Common/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubjectManager = () => {
  const [subjects, setSubjects] = useState([]); // Holds the list of subjects
  const [newSubject, setNewSubject] = useState(''); // Holds the value of the input field
  const [loading, setLoading] = useState(false); // Loading state
  

  // Fetch all subjects on component load
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/subject/all');
        console.log('API Response:', response.data); // Debugging
    
        setSubjects(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        
        if (error.response?.status === 404) {
         // toast.warning('No subjects found!');
          setSubjects([]); // Prevent crash
        } else {
       //   toast.error('Error fetching subjects!');
        }
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchSubjects();
  }, []);
  

  // Add a new subject
  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      toast.warning('Please enter a subject name!');
      return;
    }

    try {
      const response = await axiosInstance.post(`/subject/${newSubject.trim()}`);
      setSubjects(prev => [...prev, response.data]);
      setNewSubject('');
    //  toast.success('Subject added successfully!');
    } catch (error) {
      console.error('Error adding subject:', error);
     // toast.error('Error adding subject!');
    }
  };

  // Delete a subject
  const handleDeleteSubject = async (id) => {
    try {
      await axiosInstance.delete(`/subject/${id}`);
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      //toast.success('Subject deleted successfully!');
    } catch (error) {
      console.error('Error deleting subject:', error);
     // toast.error('Error deleting subject!');
    }
  };

  return (
    <div className="w-full sm:w-80 mx-auto p-4 bg-white border rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
      <ToastContainer autoClose={3000} />

      <h1 className="text-lg font-bold mb-3 text-center">Subject Manager</h1>

      {/* Input for adding new subject */}
      <div className="flex mb-3">
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Add subject"
          className="w-full px-2 py-1 text-sm border rounded-l-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleAddSubject}
          className="bg-blue-500 text-white px-3 py-1 text-sm rounded-r-md hover:bg-blue-600 transition duration-200"
        >
          Add
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-center text-gray-600">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {subjects.map((subject) => (
            <li
              key={subject.id}
              className="flex justify-between items-center p-2 bg-gray-100 rounded-md text-sm shadow"
            >
              <span>{subject.subjectName}</span>
              <button
                onClick={() => handleDeleteSubject(subject.id)}
                className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubjectManager;
