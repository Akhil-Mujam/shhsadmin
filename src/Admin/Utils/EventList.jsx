import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from "../../Common/axios";
import { Link, useNavigate } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageSize = 6;
  const initialLoad = useRef(true);
  const navigate = useNavigate();

  const fetchEvents = async (pageNumber) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/events?page=${pageNumber}&size=${pageSize}`);
      const newEvents = res.data.content || [];
      setEvents((prev) => [...prev, ...newEvents]);
      setHasMore(!res.data.last);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/api/events/${eventId}`);
      setEvents((prev) => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      fetchEvents(page);
    }
  }, []);

  const handleViewMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 text-center sm:text-left">
          📸 School Events Gallery
        </h1>
        <Link
          to="/events/new"
          className="border border-green-600 bg-green-600 text-white text-sm sm:text-base font-semibold px-5 py-2 rounded-full hover:bg-white hover:text-green-700 transition-all duration-300 shadow"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 && !loading ? (
        <p className="text-center text-gray-500 text-lg">No events available at the moment.</p>
      ) : (
        <>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col"
              >
                {event.thumbnailUrl && (
                  <img
                    src={event.thumbnailUrl}
                    alt={event.name}
                    loading="lazy"
                    className="w-full h-52 object-cover"
                  />
                )}
                <div className="p-6 flex flex-col justify-between h-full flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2 line-clamp-1">
                      {event.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
                      {event.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">📅 {event.eventDate}</p>
                  </div>
                  <div className="mt-5 flex justify-between gap-2">
                    <Link
                      to={`/events/${event.id}`}
                      className="border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-full text-sm transition-all"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => navigate(`/events/edit/${event.id}`)}
                      className="border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white px-3 py-1 rounded-full text-sm transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="border border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1 rounded-full text-sm transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleViewMore}
                disabled={loading}
                className="border border-blue-600 bg-blue-600 text-white px-6 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
              >
                {loading ? 'Loading...' : 'View More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EventList;
