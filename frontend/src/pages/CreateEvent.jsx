import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function CreateEvent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        eventDate: "",
        capacity: "",
        ticketPrice: "",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${API}/events`,
                {
                    ...form,
                    capacity: Number(form.capacity),
                    ticketPrice: Number(form.ticketPrice),
                },
                { headers: { Authorization: token } }
            );
            alert(`Event created! ID: ${response.data.eventId}`);
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    }

    const inputStyle = {
        display: "block",
        width: "100%",
        padding: "8px",
        marginBottom: "15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
    };

    return (
        <div style={{ padding: "30px", maxWidth: "600px" }}>
            <h1>Create New Event</h1>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="AWS Summit Bhubaneswar"
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="Event description..."
                />

                <label>Category</label>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Art">Art</option>
                    <option value="Other">Other</option>
                </select>

                <label>Location</label>
                <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="Bhubaneswar, Odisha"
                />

                <label>Event Date (YYYY-MM-DD)</label>
                <input
                    name="eventDate"
                    type="date"
                    value={form.eventDate}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label>Capacity</label>
                <input
                    name="capacity"
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="500"
                />

                <label>Ticket Price (₹)</label>
                <input
                    name="ticketPrice"
                    type="number"
                    min="0"
                    value={form.ticketPrice}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="499"
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "10px 24px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "15px",
                    }}
                >
                    {loading ? "Creating..." : "Create Event"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    style={{
                        marginLeft: "12px",
                        padding: "10px 20px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "15px",
                    }}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
