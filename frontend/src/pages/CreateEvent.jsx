import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function CreateEvent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", category: "", location: "", eventDate: "", capacity: "", ticketPrice: "" });

    function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        setLoading(true);
        try {
            const res = await axios.post(`${API}/events`, { ...form, capacity: Number(form.capacity), ticketPrice: Number(form.ticketPrice) }, { headers: { Authorization: token } });
            alert(`✅ Event created!\nID: ${res.data.eventId}`);
            navigate("/dashboard");
        } catch (e) {
            alert(e.response?.data?.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-event-page">
            <Navbar />
            <div className="create-event-content">
                <div className="create-event-header">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard")} style={{ marginBottom: 16 }}>← Back to Dashboard</button>
                    <h1>Create New Event</h1>
                    <p>Fill in the details to publish your event</p>
                </div>

                <div className="create-event-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <label>Event Title *</label>
                            <input className="input" name="title" value={form.title} onChange={handleChange} required placeholder="AWS Summit Bhubaneswar 2026" />
                        </div>

                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <label>Description *</label>
                            <textarea className="input" name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe your event..." />
                        </div>

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Category *</label>
                                <select className="input" name="category" value={form.category} onChange={handleChange} required>
                                    <option value="">Select category</option>
                                    {["Technology", "Business", "Music", "Sports", "Education", "Art", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location *</label>
                                <input className="input" name="location" value={form.location} onChange={handleChange} required placeholder="Bhubaneswar, Odisha" />
                            </div>
                            <div className="form-group">
                                <label>Event Date *</label>
                                <input className="input" type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Capacity *</label>
                                <input className="input" type="number" name="capacity" value={form.capacity} onChange={handleChange} required min="1" placeholder="500" />
                            </div>
                            <div className="form-group">
                                <label>Ticket Price (₹) *</label>
                                <input className="input" type="number" name="ticketPrice" value={form.ticketPrice} onChange={handleChange} required min="0" placeholder="499" />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? "Creating..." : "🚀 Publish Event"}
                            </button>
                            <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate("/dashboard")}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
