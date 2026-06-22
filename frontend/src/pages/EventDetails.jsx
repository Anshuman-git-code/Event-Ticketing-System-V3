import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function EventDetails() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);

    useEffect(() => {
        loadEvent();
    }, []);

    async function loadEvent() {
        try {
            const response = await axios.get(`${API}/events/${eventId}`);
            setEvent(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function registerEvent() {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post(
                `${API}/events/${eventId}/register`,
                {},
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            alert(`Registration Successful: ${response.data.registrationId}`);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration Failed");
        }
    }

    if (!event) {
        return <h2>Loading...</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>{event.title}</h1>
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
            <button onClick={registerEvent}>Register</button>
        </div>
    );
}
