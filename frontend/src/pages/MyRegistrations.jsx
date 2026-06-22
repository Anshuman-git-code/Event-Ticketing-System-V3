import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        loadRegistrations();
    }, []);

    async function loadRegistrations() {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API}/registrations/my`, {
                headers: {
                    Authorization: token,
                },
            });

            setRegistrations(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>My Registrations</h1>

            {registrations.map((registration) => (
                <div
                    key={registration.registrationId}
                    style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        marginBottom: "15px",
                    }}
                >
                    <p>
                        <b>Registration ID:</b> {registration.registrationId}
                    </p>

                    <p>
                        <b>Event ID:</b> {registration.eventId}
                    </p>

                    <p>
                        <b>Status:</b> {registration.registrationStatus}
                    </p>
                </div>
            ))}
        </div>
    );
}
