import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

const CATEGORIES = ["All", "Technology", "Business", "Music", "Sports", "Education", "Art", "Other"];

const CAT_ICONS = { Technology: "💻", Business: "💼", Music: "🎵", Sports: "🏆", Education: "🎓", Art: "🎨", Other: "⚡", All: "⚡" };
const CAT_CLASS = { Technology: "banner-technology", Business: "banner-business", Music: "banner-music", Sports: "banner-sports", Education: "banner-education", Art: "banner-art", Other: "banner-other" };

// Free Unsplash photos — one per category, works for ALL events including future ones
const CAT_IMAGES = {
    Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=75",
    Business: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=75",
    Music: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=75",
    Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=75",
    Education: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=75",
    Art: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&q=75",
    Other: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=75",
};

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const q = searchParams.get("search");
        if (q) setSearch(q);
    }, []);

    useEffect(() => {
        loadEvents();
    }, [category, status]);

    async function loadEvents() {
        setLoading(true);
        try {
            const params = {};
            if (category && category !== "All") params.category = category;
            if (status) params.status = status;
            const res = await axios.get(`${API}/events`, { params });
            setEvents(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const filtered = events.filter((e) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q);
    });

    return (
        <div className="page-wrap">
            <Navbar />

            {/* HERO */}
            <div className="hero">
                <div className="hero-inner">
                    <div>
                        <div className="hero-label">🎟 Premium Event Platform</div>
                        <h1>Discover Amazing <span>Events</span></h1>
                        <p className="hero-sub">Find conferences, meetups, workshops, concerts and networking events near you.</p>
                        <div className="hero-actions">
                            <button className="btn btn-primary btn-lg" onClick={() => document.getElementById("events-list").scrollIntoView({ behavior: "smooth" })}>
                                Browse Events →
                            </button>
                            <Link to="/dashboard"><button className="btn btn-ghost btn-lg">Organizer Dashboard</button></Link>
                        </div>
                        <div className="hero-trust">
                            <span className="hero-trust-item">🎟 Easy Booking</span>
                            <span className="hero-trust-item">⚡ Instant Tickets</span>
                            <span className="hero-trust-item">🛡 Secure &amp; Reliable</span>
                        </div>
                    </div>
                    <div className="hero-image" style={{ padding: 0, position: "relative" }}>
                        <img
                            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"
                            alt="Live event crowd"
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "22px", filter: "brightness(0.75) saturate(1.2)" }}
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,0,85,0.15) 0%,transparent 60%)", borderRadius: "22px", pointerEvents: "none" }} />
                    </div>
                </div>
            </div>

            {/* CATEGORIES */}
            <div className="category-section">
                <div className="category-section-inner">
                    <h2>Browse by Category</h2>
                    <div className="category-pills">
                        {CATEGORIES.map((c) => (
                            <button key={c} className={`cat-pill ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
                                <span className="cat-icon">{CAT_ICONS[c] || "⚡"}</span>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* METRICS BAR */}
            <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 24px" }}>
                <div className="metrics-bar">
                    <div className="metric-item">
                        <span className="metric-icon">🎟</span>
                        <div><div className="metric-value">100+</div><div className="metric-label">Events Available</div></div>
                    </div>
                    <div className="metric-item">
                        <span className="metric-icon">👥</span>
                        <div><div className="metric-value">5+</div><div className="metric-label">Categories</div></div>
                    </div>
                    <div className="metric-item">
                        <span className="metric-icon">⚡</span>
                        <div><div className="metric-value">Instant</div><div className="metric-label">Ticket Delivery</div></div>
                    </div>
                    <div className="metric-item">
                        <span className="metric-icon">☁️</span>
                        <div><div className="metric-value">AWS</div><div className="metric-label">Cloud Powered</div></div>
                    </div>
                </div>
            </div>

            {/* EVENTS LIST */}
            <div className="events-section" id="events-list">
                <div className="events-section-inner">
                    {/* FILTER BAR */}
                    <div className="filter-bar">
                        <div className="filter-search input-icon-wrap">
                            <span className="input-icon">🔍</span>
                            <input className="input" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
                        </div>
                        <select className="input filter-select" value={category === "All" ? "" : category} onChange={(e) => setCategory(e.target.value || "All")}>
                            <option value="">All Categories</option>
                            {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select className="input filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="DRAFT">Draft</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        {(search || category !== "All" || status) && (
                            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(""); setCategory("All"); setStatus(""); }}>
                                ↺ Clear
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading-screen"><div className="spinner"></div></div>
                    ) : filtered.length === 0 ? (
                        <div className="no-events">
                            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                            <p>No events found. Try different filters.</p>
                        </div>
                    ) : (
                        <div className="events-grid">
                            {filtered.map((event) => {
                                const cat = event.category || "Other";
                                const bannerClass = CAT_CLASS[cat] || "banner-default";
                                return (
                                    <div key={event.eventId} className="event-card">
                                        <div className={`event-card-banner ${bannerClass}`} style={{ position: "relative", overflow: "hidden" }}>
                                            <img
                                                src={CAT_IMAGES[cat] || CAT_IMAGES["Other"]}
                                                alt={cat}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, filter: "brightness(0.7) saturate(1.1)" }}
                                                onError={(e) => { e.target.style.display = "none"; }}
                                            />
                                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                                        </div>
                                        <div className="event-card-body">
                                            <div className="event-card-meta-row">
                                                <span className="badge">{cat}</span>
                                                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{event.status}</span>
                                            </div>
                                            <div className="event-card-title">{event.title}</div>
                                            <div className="event-card-info"><span className="icon">📍</span>{event.location}</div>
                                            <div className="event-card-info"><span className="icon">📅</span>{event.eventDate}</div>
                                            <div className="event-card-footer">
                                                <span className="event-price">₹{event.ticketPrice}</span>
                                                <Link to={`/events/${event.eventId}`}>
                                                    <button className="btn btn-primary btn-sm">View Details →</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <p className="footer-note">⭐ More amazing events coming your way!</p>
                </div>
            </div>
        </div>
    );
}
