import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageSize = 6;
  const initialLoad = useRef(true); // To prevent double-fetch on mount

  const fetchEvents = async (pageNumber) => {
    if (loading) return;
    setLoading(true);
    try {

      console.log("Fetching event details from get method before axios")
      const res = await axios.get(`/api/events?page=${pageNumber}&size=${pageSize}`);
      console.log("Fetching event details from get method after axios")
      const newEvents = res.data.content || [];
      console.log(newEvents);
      setEvents((prev) => [...prev, ...newEvents]);
      setHasMore(!res.data.last);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Avoid double fetch on initial render
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
          className="bg-green-600 text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow hover:bg-green-700 transition duration-200"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 && !loading ? (
        <p className="text-center text-gray-500 text-lg">No events available at the moment.</p>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden"
              >
                {event.thumbnailUrl && (
                  <img
                    src={event.thumbnailUrl}
                    alt={event.name}
                    loading="lazy"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-2 line-clamp-1">
                      {event.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">📅 {event.eventDate}</p>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleViewMore}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition"
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
