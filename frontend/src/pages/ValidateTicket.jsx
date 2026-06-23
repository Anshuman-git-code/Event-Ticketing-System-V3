import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function ValidateTicket() {
    const navigate = useNavigate();
    const [ticketId, setTicketId] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function validate() {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        if (!ticketId.trim()) { setError("Please enter a ticket ID"); return; }
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await axios.post(`${API}/tickets/${ticketId.trim()}/validate`, {}, { headers: { Authorization: token } });
            setResult({ success: true, data: res.data });
        } catch (e) {
            setResult({ success: false, message: e.response?.data?.message || "Validation failed" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="validate-page">
            <div className="validate-wrap">
                <Navbar />
                <div style={{ paddingTop: 40 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard")} style={{ marginBottom: 20 }}>← Back</button>
                    <h1>Validate Ticket</h1>
                    <p className="subtitle">Enter the ticket ID from the QR code to mark entry.</p>

                    <div className="validate-card">
                        <label style={{ display: "block", fontWeight: 600, marginBottom: 10, color: "var(--text-h)" }}>Ticket ID</label>
                        <input
                            className="input"
                            value={ticketId}
                            onChange={e => setTicketId(e.target.value)}
                            placeholder="tkt_abc12345"
                            onKeyDown={e => e.key === "Enter" && validate()}
                        />

                        {error && <p style={{ color: "#ef4444", marginTop: 10, fontSize: 14 }}>{error}</p>}

                        <div className="validate-actions">
                            <button className="btn btn-primary" onClick={validate} disabled={loading}>
                                {loading ? "Validating..." : "✅ Validate"}
                            </button>
                            <button className="btn btn-ghost" onClick={() => { setTicketId(""); setResult(null); setError(""); }}>
                                Clear
                            </button>
                        </div>

                        {result && result.success && (
                            <div className="validate-result-success">
                                <h3>✅ Ticket Valid — Entry Approved</h3>
                                <div className="info-row"><span className="lbl">Ticket ID</span><span className="val">{result.data.ticketId}</span></div>
                                <div className="info-row"><span className="lbl">Status</span><span className="val">{result.data.status}</span></div>
                                <div className="info-row"><span className="lbl">Validated At</span><span className="val">{result.data.validatedAt}</span></div>
                            </div>
                        )}

                        {result && !result.success && (
                            <div className="validate-result-fail">
                                <h3>❌ Validation Failed</h3>
                                <p>{result.message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
