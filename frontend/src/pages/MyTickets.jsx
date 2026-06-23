import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function MyTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        axios.get(`${API}/tickets/my`, { headers: { Authorization: token } })
            .then(r => setTickets(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function downloadTicket(ticketId) {
        setDownloading(ticketId);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API}/tickets/${ticketId}/download`, { headers: { Authorization: token } });
            window.open(res.data.downloadUrl, "_blank");
        } catch (e) {
            alert("Download failed");
        } finally {
            setDownloading(null);
        }
    }

    const valid = tickets.filter(t => t.ticketStatus === "VALID").length;
    const used = tickets.filter(t => t.ticketStatus === "USED").length;

    return (
        <div className="list-page">
            <Navbar />
            <div className="list-content">
                <div className="list-header">
                    <h1>My Tickets</h1>
                    <p>Your QR tickets for registered events</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card"><div className="stat-icon">🎟</div><div className="stat-label">Total Tickets</div><div className="stat-value">{tickets.length}</div></div>
                    <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-label">Valid</div><div className="stat-value">{valid}</div></div>
                    <div className="stat-card"><div className="stat-icon">🏁</div><div className="stat-label">Used</div><div className="stat-value">{used}</div></div>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="spinner"></div></div>
                ) : tickets.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎟</div>
                        <p>No tickets yet. Register for an event to get your ticket!</p>
                    </div>
                ) : (
                    <div className="list-grid">
                        {tickets.map(ticket => (
                            <div key={ticket.ticketId} className="ticket-card-item">
                                <div className="ticket-card-top">
                                    <span className="badge">QR Ticket</span>
                                    <span className={`badge ${ticket.ticketStatus === "VALID" ? "badge-green" : "badge-amber"}`}>{ticket.ticketStatus}</span>
                                </div>
                                <div className="info-row"><span className="lbl">Ticket ID</span><span className="val">{ticket.ticketId}</span></div>
                                <div className="info-row"><span className="lbl">Event ID</span><span className="val">{ticket.eventId}</span></div>
                                <div className="info-row"><span className="lbl">Issued At</span><span className="val">{ticket.issuedAt || "—"}</span></div>
                                {ticket.validatedAt && <div className="info-row"><span className="lbl">Validated At</span><span className="val">{ticket.validatedAt}</span></div>}
                                <button
                                    className="btn btn-primary btn-full"
                                    style={{ marginTop: 16 }}
                                    onClick={() => downloadTicket(ticket.ticketId)}
                                    disabled={downloading === ticket.ticketId}
                                >
                                    {downloading === ticket.ticketId ? "Downloading..." : "⬇ Download QR Ticket"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
