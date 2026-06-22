import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
            <h1>Organizer Dashboard</h1>

            {events.map((event) => (
                <div
                    key={event.eventId}
                    style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        marginBottom: "15px",
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