import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        axios.get(`${API}/registrations/my`, { headers: { Authorization: token } })
            .then(r => setRegistrations(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const confirmed = registrations.filter(r => r.status === "REGISTERED").length;

    return (
        <div className="list-page">
            <Navbar />
            <div className="list-content">
                <div className="list-header">
                    <h1>My Registrations</h1>
                    <p>Events you have registered for</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-label">Total</div><div className="stat-value">{registrations.length}</div></div>
                    <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-label">Confirmed</div><div className="stat-value">{confirmed}</div></div>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="spinner"></div></div>
                ) : registrations.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>No registrations yet. Browse events to register!</p>
                    </div>
                ) : (
                    <div className="list-grid">
                        {registrations.map(reg => (
                            <div key={reg.registrationId} className="reg-card">
                                <div className="reg-card-top">
                                    <span className="badge">Registration</span>
                                    <span className="badge badge-green">{reg.status || "REGISTERED"}</span>
                                </div>
                                <div className="info-row"><span className="lbl">Registration ID</span><span className="val">{reg.registrationId}</span></div>
                                <div className="info-row"><span className="lbl">Event ID</span><span className="val">{reg.eventId}</span></div>
                                <div className="info-row" style={{ borderBottom: "none" }}><span className="lbl">Registered At</span><span className="val">{reg.registeredAt || "—"}</span></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
