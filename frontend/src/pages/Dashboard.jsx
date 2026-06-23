import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";
const CAT_CLASS = { Technology: "banner-technology", Business: "banner-business", Music: "banner-music", Sports: "banner-sports", Education: "banner-education", Art: "banner-art", Other: "banner-other" };

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        axios.get(`${API}/events/my`, { headers: { Authorization: token } })
            .then(r => setEvents(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const published = events.filter(e => e.status === "PUBLISHED").length;
    const draft = events.filter(e => e.status === "DRAFT").length;

    return (
        <div className="dashboard-page">
            <Navbar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <div>
                        <h1>Organizer Dashboard</h1>
                        <p>Manage your events and view analytics</p>
                    </div>
                    <div className="dashboard-actions">
                        <Link to="/dashboard/create"><button className="btn btn-primary">+ Create Event</button></Link>
                        <Link to="/validate-ticket"><button className="btn btn-secondary">✅ Validate Ticket</button></Link>
                    </div>
                </div>

                {/* STATS */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🎪</div>
                        <div className="stat-label">Total Events</div>
                        <div className="stat-value">{events.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-label">Published</div>
                        <div className="stat-value">{published}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-label">Draft</div>
                        <div className="stat-value">{draft}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">☁️</div>
                        <div className="stat-label">AWS Powered</div>
                        <div className="stat-value" style={{ fontSize: 16 }}>Live</div>
                    </div>
                </div>

                {/* EVENTS */}
                <div className="section-header">
                    <h2>Your Events</h2>
                    <p>Events you have created and published</p>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="spinner"></div></div>
                ) : events.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎪</div>
                        <p>No events yet. Create your first event!</p>
                        <Link to="/dashboard/create"><button className="btn btn-primary" style={{ marginTop: 16 }}>+ Create Event</button></Link>
                    </div>
                ) : (
                    <div className="dashboard-events-grid">
                        {events.map(event => (
                            <div key={event.eventId} className="dashboard-event-card">
                                <div style={{ marginBottom: 12 }}><span className="badge">{event.category || "Event"}</span></div>
                                <h3>{event.title}</h3>
                                <p>📍 {event.location}</p>
                                <p>📅 {event.eventDate}</p>
                                <p style={{ fontSize: 11, wordBreak: "break-all", color: "var(--text-muted)", marginTop: 6 }}>ID: {event.eventId}</p>
                                <div className="dashboard-event-footer">
                                    <span className={`badge ${event.status === "PUBLISHED" ? "badge-green" : "badge-amber"}`}>{event.status}</span>
                                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/dashboard/event/${event.eventId}`)}>
                                        📊 Analytics
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
