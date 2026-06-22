import { useEffect, useState } from "react";
import axios from "axios";

const API =
    "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {
        try {
            const response = await axios.get(`${API}/events`);

            setEvents(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Event Ticketing System</h1>

            {events.map((event) => (
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

                    <p>
                        <b>Location:</b> {event.location}
                    </p>

                    <p>
                        <b>Date:</b> {event.eventDate}
                    </p>

                    <p>
                        <b>Price:</b> ₹{event.ticketPrice}
                    </p>

                    <button>View Details</button>
                </div>
            ))}
        </div>
    );
}