import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API =
    "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function Dashboard() {
    const [events, setEvents] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadMyEvents();
    }, []);

    async function loadMyEvents() {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API}/events/my`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            setEvents(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{ padding: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1>Organizer Dashboard</h1>
                <div>
                    <button
                        onClick={() => navigate("/dashboard/create")}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            marginRight: "12px",
                        }}
                    >
                        + Create Event
                    </button>
                    <Link to="/validate-ticket">
                        <button
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            Validate Ticket
                        </button>
                    </Link>
                </div>
            </div>

            {events.length === 0 && <p>No events yet. Create your first event!</p>}

            {events.map((event) => (
                <div
                    key={event.eventId}
                    style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                    }}
                >
                    <h3>{event.title}</h3>

                    <p>{event.description}</p>

                    <p>
                        <b>Event ID:</b> {event.eventId}
                    </p>

                    <p>
                        <b>Date:</b> {event.eventDate}
                    </p>

                    <p>
                        <b>Category:</b> {event.category}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                `/dashboard/event/${event.eventId}`
                            )
                        }
                    >
                        View Analytics
                    </button>
                </div>
            ))}
        </div>
    );
}