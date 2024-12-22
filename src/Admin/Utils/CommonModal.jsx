import React, { useState, useEffect } from 'react';

const CommonModal = ({ 
  isVisible, 
  onClose, 
  onSubmit, 
  onDelete, 
  fields, 
  title, 
  initialData, 
  defaultRole 
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      // Populate form data with the initialData for editing
      setFormData({ ...initialData });
    } else {
      // Set default values for new entries
      const defaultData = { role: defaultRole };
      fields.forEach((field) => {
        defaultData[field.key] = field.default || ''; // Use default values if provided
      });
      setFormData(defaultData);
    }
  }, [initialData, defaultRole, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
        {fields.map((field) => (
          <div key={field.key} className="mb-4">
            <input
              type="text"
              name={field.key}
              value={formData[field.key] || ''}
              onChange={handleChange}
              placeholder={field.label}
              className="p-2 border border-gray-300 rounded-lg w-full"
              disabled={field.disabled} // Non-editable fields
            />
          </div>
        ))}
        <div className="flex justify-end mt-4">
          {title.includes('Edit') && (
            <button
              onClick={() => onDelete(formData.regNo)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            {title.includes('Edit') ? 'Update' : 'Add'}
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
