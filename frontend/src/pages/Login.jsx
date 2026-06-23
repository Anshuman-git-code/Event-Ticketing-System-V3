import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "ap-south-1_A9hMJ4TDH",
    ClientId: "5nsmvbovqr6e7hri29dm12fkph",
};
const userPool = new CognitoUserPool(poolData);

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function login() {
        if (!email || !password) { setError("Please enter email and password."); return; }
        setLoading(true); setError("");
        const authDetails = new AuthenticationDetails({ Username: email, Password: password });
        const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
                localStorage.setItem("token", result.getIdToken().getJwtToken());
                setLoading(false);
                navigate("/");
            },
            onFailure: (err) => {
                setError(err.message || "Login failed");
                setLoading(false);
            },
        });
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🎟</div>
                    <h2>Event<span>Sphere</span></h2>
                    <p>Sign in to your account</p>
                </div>

                {error && (
                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, color: "#fca5a5", fontSize: 14 }}>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
                </div>

                <button className="btn btn-primary btn-full btn-lg" onClick={login} disabled={loading} style={{ marginTop: 8 }}>
                    {loading ? "Signing in..." : "Sign In →"}
                </button>

                <div className="login-footer">
                    <Link to="/" style={{ color: "var(--accent2)" }}>← Back to Events</Link>
                </div>
            </div>
        </div>
    );
}
