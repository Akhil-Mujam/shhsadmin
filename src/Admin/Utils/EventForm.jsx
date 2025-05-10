import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Common/axios";

const EventForm = () => {
  const [event, setEvent] = useState({
    name: "",
    description: "",
    eventDate: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { eventId } = useParams(); // For edit mode

  useEffect(() => {
    if (eventId) {
      // Editing mode
      setIsEditMode(true);
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const res = await axiosInstance.get(`/api/events/${eventId}`);
      setEvent({
        name: res.data.name,
        description: res.data.description,
        eventDate: res.data.eventDate,
      });
    } catch (err) {
      console.error("Failed to fetch event:", err);
      alert("Failed to load event details.");
    }
  };

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", event.name);
    formData.append("description", event.description);
    formData.append("eventDate", event.eventDate);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    setLoading(true);
    try {
      if (isEditMode) {
        // Editing existing event
        await axiosInstance.put(`/api/events/${eventId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate(`/events/${eventId}`);
      } else {
        // Creating new event
        const res = await axiosInstance.post("/api/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate(`/events/${res.data.id}`);
      }
    } catch (err) {
      console.error("Failed to submit event:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <button
        onClick={() => navigate("/events")}
        className="mb-4 text-sm text-blue-600 hover:underline flex items-center"
      >
        ← Back to Event List
      </button>

      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        {isEditMode ? "Edit Event" : "Create New Event"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Event Name</label>
          <input
            type="text"
            name="name"
            value={event.name}
            onChange={handleChange}
            placeholder="Annual Day, Science Fair, etc."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Event Description</label>
          <textarea
            name="description"
            value={event.description}
            onChange={handleChange}
            placeholder="Enter a brief description..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={event.eventDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            {isEditMode ? "Change Thumbnail (optional)" : "Thumbnail Image"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full"
            // Not required in edit mode
            required={!isEditMode}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white ${
            loading ? "bg-green-300" : "bg-blue-500 hover:bg-blue-700"
          } transition`}
        >
          {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
