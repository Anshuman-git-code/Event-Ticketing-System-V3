import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API =
    "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod";

export default function Analytics() {
    const { eventId } = useParams();

    const [analytics, setAnalytics] =
        useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    async function loadAnalytics() {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API}/events/${eventId}/analytics`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            setAnalytics(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    if (!analytics) {
        return <h2>Loading...</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Event Analytics</h1>

            <p>
                <b>Event ID:</b> {analytics.eventId}
            </p>

            <p>
                <b>Registrations:</b>{" "}
                {analytics.registrations}
            </p>

            <p>
                <b>Tickets Issued:</b>{" "}
                {analytics.ticketsIssued}
            </p>

            <p>
                <b>Tickets Used:</b>{" "}
                {analytics.ticketsUsed}
            </p>

            <p>
                <b>Attendance Rate:</b>{" "}
                {analytics.attendanceRate}%
            </p>
        </div>
    );
}