import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

const CATEGORIES = ["", "Technology", "Music", "Sports", "Business", "Education", "Art", "Other"];

export default function Events() {
    const [events, setEvents] = useState([]);
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadEvents();
    }, [category, status]);

    async function loadEvents() {
        try {
            const params = {};
            if (category) params.category = category;
            if (status) params.status = status;
            const response = await axios.get(`${API}/events`, { params });
            setEvents(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const filtered = events.filter((e) =>
        search === "" ||
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.location?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1>Event Ticketing System</h1>
                <div>
                    <Link to="/login" style={{ marginRight: "12px" }}>Login</Link>
                    <Link to="/dashboard" style={{ marginRight: "12px" }}>Dashboard</Link>
                    <Link to="/my-registrations" style={{ marginRight: "12px" }}>My Registrations</Link>
                    <Link to="/my-tickets">My Tickets</Link>
                </div>
            </div>

            {/* Search & Filter */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                <input
                    placeholder="Search by title or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "240px" }}
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.filter(Boolean).map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                    <option value="">All Statuses</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
                {(category || status || search) && (
                    <button
                        onClick={() => { setCategory(""); setStatus(""); setSearch(""); }}
                        style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {filtered.length === 0 && <p>No events found.</p>}

            {filtered.map((event) => (
                <div
                    key={event.eventId}
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                    }}
                >
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p><b>Category:</b> {event.category}</p>
                    <p><b>Location:</b> {event.location}</p>
                    <p><b>Date:</b> {event.eventDate}</p>
                    <p><b>Price:</b> ₹{event.ticketPrice}</p>
                    <p><b>Status:</b> {event.status}</p>
                    <Link to={`/events/${event.eventId}`}>
                        <button>View Details</button>
                    </Link>
                </div>
            ))}
        </div>
    );
}
