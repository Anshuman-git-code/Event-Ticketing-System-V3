import { useEffect, useState } from "react";
import axios from "axios";

const API =
    "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function MyTickets() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        loadTickets();
    }, []);

    async function loadTickets() {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API}/tickets/my`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            setTickets(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function downloadTicket(ticketId) {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API}/tickets/${ticketId}/download`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            window.open(
                response.data.downloadUrl,
                "_blank"
            );
        } catch (error) {
            console.error(error);

            alert("Download failed");
        }
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>My Tickets</h1>

            {tickets.map((ticket) => (
                <div
                    key={ticket.ticketId}
                    style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        marginBottom: "15px",
                    }}
                >
                    <p>
                        <b>Ticket ID:</b> {ticket.ticketId}
                    </p>

                    <p>
                        <b>Event ID:</b> {ticket.eventId}
                    </p>

                    <p>
                        <b>Status:</b> {ticket.ticketStatus}
                    </p>

                    <button
                        onClick={() =>
                            downloadTicket(ticket.ticketId)
                        }
                    >
                        Download Ticket
                    </button>
                </div>
            ))}
        </div>
    );
}