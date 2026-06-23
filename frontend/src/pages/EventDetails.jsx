import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";
const CAT_CLASS = { Technology: "banner-technology", Business: "banner-business", Music: "banner-music", Sports: "banner-sports", Education: "banner-education", Art: "banner-art", Other: "banner-other" };
const CAT_ICONS = { Technology: "💻", Business: "💼", Music: "🎵", Sports: "🏆", Education: "🎓", Art: "🎨", Other: "⚡" };

export default function EventDetails() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        axios.get(`${API}/events/${eventId}`)
            .then(r => setEvent(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [eventId]);

    async function registerEvent() {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        setRegistering(true);
        try {
            const res = await axios.post(`${API}/events/${eventId}/register`, {}, { headers: { Authorization: token } });
            alert(`✅ Registration Successful!\nRegistration ID: ${res.data.registrationId}`);
        } catch (e) {
            alert(e.response?.data?.message || "Registration failed");
        } finally {
            setRegistering(false);
        }
    }

    if (loading) return <div className="page-wrap"><Navbar /><div className="loading-screen"><div className="spinner"></div></div></div>;
    if (!event) return <div className="page-wrap"><Navbar /><div className="no-events">Event not found</div></div>;

    const cat = event.category || "Other";
    const bannerClass = CAT_CLASS[cat] || "banner-default";

    return (
        <div className="event-details-page">
            <Navbar />

            {/* HERO BANNER */}
            <div className={`event-details-hero ${bannerClass}`} style={{ minHeight: 360 }}>
                <div className="event-details-hero-bg">
                    <span className="hero-icon">{CAT_ICONS[cat] || "🎪"}</span>
                </div>
                <div className="event-details-hero-overlay" />
                <div className="event-details-hero-content">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
                    <div style={{ marginBottom: 12 }}><span className="badge">{cat}</span></div>
                    <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", margin: 0 }}>{event.title}</h1>
                </div>
            </div>

            <div className="event-details-layout">
                {/* MAIN */}
                <div className="event-details-main">
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text)", fontSize: 15 }}>📍 {event.location}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text)", fontSize: 15 }}>📅 {event.eventDate}</span>
                        <span className={`badge ${event.status === "PUBLISHED" ? "badge-green" : "badge-amber"}`}>{event.status}</span>
                    </div>

                    <div className="event-details-description">
                        <h3>About this Event</h3>
                        <p>{event.description || "No description provided."}</p>
                    </div>

                    <div className="event-details-description" style={{ marginTop: 20 }}>
                        <h3>Event Highlights</h3>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                            {["Live Sessions", "Networking", "Q&A", "Certificate"].map(tag => (
                                <span key={tag} className="badge badge-blue">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOOKING CARD */}
                <div className="event-booking-card">
                    <div className="event-booking-info"><span className="label">Price</span><span className="value" style={{ color: "var(--accent2)", fontSize: 20, fontWeight: 800 }}>₹{event.ticketPrice}</span></div>
                    <div className="event-booking-info"><span className="label">Date</span><span className="value">📅 {event.eventDate}</span></div>
                    <div className="event-booking-info"><span className="label">Location</span><span className="value">📍 {event.location}</span></div>
                    <div className="event-booking-info"><span className="label">Capacity</span><span className="value">{event.capacity} seats</span></div>
                    <div className="event-booking-info"><span className="label">Status</span><span className="value">{event.status}</span></div>
                    <button
                        className="btn btn-primary btn-full"
                        style={{ marginTop: 24, padding: 16, fontSize: 16 }}
                        onClick={registerEvent}
                        disabled={registering}
                    >
                        {registering ? "Registering..." : "🎟 Register Now"}
                    </button>
                    <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
                        Secure registration · Instant ticket delivery
                    </p>
                </div>
            </div>
        </div>
    );
}
