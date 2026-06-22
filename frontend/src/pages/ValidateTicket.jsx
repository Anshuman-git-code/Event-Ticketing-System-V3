import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function ValidateTicket() {
    const navigate = useNavigate();
    const [ticketId, setTicketId] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function validate() {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        if (!ticketId.trim()) {
            setError("Please enter a ticket ID");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await axios.post(
                `${API}/tickets/${ticketId.trim()}/validate`,
                {},
                { headers: { Authorization: token } }
            );
            setResult({ success: true, data: response.data });
        } catch (err) {
            const message =
                err.response?.data?.message || "Validation failed";
            setResult({ success: false, message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: "30px", maxWidth: "500px" }}>
            <h1>Validate Ticket</h1>
            <p style={{ color: "#666" }}>
                Enter the ticket ID from the QR code to mark it as used.
            </p>

            <input
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="tkt_abc12345"
                style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "15px",
                    marginBottom: "12px",
                }}
                onKeyDown={(e) => e.key === "Enter" && validate()}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
                onClick={validate}
                disabled={loading}
                style={{
                    padding: "10px 24px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "15px",
                }}
            >
                {loading ? "Validating..." : "Validate Ticket"}
            </button>

            {result && (
                <div
                    style={{
                        marginTop: "24px",
                        padding: "20px",
                        borderRadius: "8px",
                        backgroundColor: result.success ? "#d4edda" : "#f8d7da",
                        border: `1px solid ${result.success ? "#c3e6cb" : "#f5c6cb"}`,
                    }}
                >
                    {result.success ? (
                        <>
                            <h3 style={{ color: "#155724" }}>✅ Ticket Valid</h3>
                            <p>
                                <b>Ticket ID:</b> {result.data.ticketId}
                            </p>
                            <p>
                                <b>Status:</b> {result.data.ticketStatus}
                            </p>
                            <p>
                                <b>Attendee ID:</b> {result.data.attendeeId}
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 style={{ color: "#721c24" }}>❌ Validation Failed</h3>
                            <p>{result.message}</p>
                        </>
                    )}
                </div>
            )}

            <br />
            <button
                onClick={() => {
                    setTicketId("");
                    setResult(null);
                    setError("");
                }}
                style={{
                    marginTop: "12px",
                    padding: "8px 16px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Clear
            </button>
        </div>
    );
}
