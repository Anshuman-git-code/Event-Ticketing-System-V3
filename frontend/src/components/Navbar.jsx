import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const isLoggedIn = !!localStorage.getItem("token");

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    function handleSearch(e) {
        e.preventDefault();
        navigate(`/?search=${encodeURIComponent(search)}`);
    }

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-icon">🎟</div>
                    Event<span>Sphere</span>
                </Link>

                <div className="navbar-search">
                    <form onSubmit={handleSearch} style={{ position: "relative" }}>
                        <span className="input-icon">🔍</span>
                        <input
                            className="input"
                            placeholder="Search events, locations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: "38px" }}
                        />
                    </form>
                </div>

                <div className="navbar-nav">
                    <Link to="/" className={location.pathname === "/" ? "active" : ""}>Events</Link>
                    <Link to="/dashboard" className={location.pathname.startsWith("/dashboard") ? "active" : ""}>Dashboard</Link>
                    <Link to="/my-registrations" className={location.pathname === "/my-registrations" ? "active" : ""}>Registrations</Link>
                    <Link to="/my-tickets" className={location.pathname === "/my-tickets" ? "active" : ""}>Tickets</Link>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="navbar-login">Logout</button>
                    ) : (
                        <Link to="/login" className="navbar-login">👤 Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
