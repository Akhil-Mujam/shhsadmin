import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MAX_IMAGES_PER_EVENT = 20;

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Failed to fetch event:", err);
      setError("Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!event) return;

    const remainingSlots = MAX_IMAGES_PER_EVENT - event.images.length;
    if (selectedFiles.length > remainingSlots) {
      alert(`You can upload only ${remainingSlots} more image(s).`);
      e.target.value = "";
      return;
    }

    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setUploading(true);
    setError("");
    try {
      await axios.post(`/api/events/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles([]);
      await fetchEvent();
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.message || "Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`/api/events/images/${imageId}`);
      await fetchEvent();
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Failed to delete image.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-blue-600 text-lg">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-red-600 hover:underline font-medium text-md"
      >
        ← Back
      </button>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-4 break-words">
        {event.name}
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
        {event.description}
      </p>

      <div className="mb-10">
        <label className="block mb-2 text-base font-semibold text-gray-800">
          Upload Images <span className="text-sm text-gray-500">(Max 20 per event)</span>
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm border border-gray-300 rounded-md shadow-sm mb-4"
        />
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {files.map((file, idx) => (
              <div key={idx} className="w-24 h-24 border rounded overflow-hidden shadow-sm">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className={`px-6 py-2.5 rounded-md text-white font-medium text-sm ${
            uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gallery</h2>
      {event.images?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {event.images.map((img) => (
            <div
              key={img.id}
              className="relative group border rounded-lg overflow-hidden shadow-sm"
            >
              <img src={img.url} alt="Event" className="w-full h-40 object-cover" />
              <button
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 px-2 text-xs rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No images uploaded yet.</p>
      )}
    </div>
  );
};

export default EventDetail;
