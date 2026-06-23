import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function Analytics() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        axios.get(`${API}/events/${eventId}/analytics`, { headers: { Authorization: token } })
            .then(r => setData(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [eventId]);

    return (
        <div className="analytics-page">
            <Navbar />
            <div className="analytics-content">
                <div className="analytics-header">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard")} style={{ marginBottom: 16 }}>← Dashboard</button>
                    <h1>Event Analytics</h1>
                    <p>Performance metrics for event: {eventId}</p>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="spinner"></div></div>
                ) : !data ? (
                    <div className="empty-state"><p>No analytics data found.</p></div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <div className="stat-label">Registrations</div>
                                <div className="stat-value">{data.registrations}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎟</div>
                                <div className="stat-label">Tickets Issued</div>
                                <div className="stat-value">{data.ticketsIssued}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✅</div>
                                <div className="stat-label">Tickets Used</div>
                                <div className="stat-value">{data.ticketsUsed}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-label">Attendance Rate</div>
                                <div className="stat-value">{data.attendanceRate}%</div>
                            </div>
                        </div>

                        <div className="analytics-detail-card">
                            <h3>Detailed Breakdown</h3>
                            <div className="analytics-row"><span className="lbl">Event ID</span><span className="val">{data.eventId}</span></div>
                            <div className="analytics-row"><span className="lbl">Total Registrations</span><span className="val">{data.registrations}</span></div>
                            <div className="analytics-row"><span className="lbl">Tickets Issued</span><span className="val">{data.ticketsIssued}</span></div>
                            <div className="analytics-row"><span className="lbl">Tickets Validated (Used)</span><span className="val">{data.ticketsUsed}</span></div>
                            <div className="analytics-row"><span className="lbl">Tickets Not Yet Used</span><span className="val">{data.ticketsIssued - data.ticketsUsed}</span></div>
                            <div className="analytics-row"><span className="lbl">Attendance Rate</span><span className="val" style={{ color: "var(--accent2)" }}>{data.attendanceRate}%</span></div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
