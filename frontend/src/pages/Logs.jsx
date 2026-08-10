import { useEffect, useState } from "react";
import API from "../services/api";

export default function Logs() {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const loadLogs = () => {

        setData(null);
        setError(null);

        API.getDockerLogs()
            .then((result) => {
                setData(result);
            })
            .catch((err) => {
                console.error("Failed to load Docker logs:", err);
                setError(err.message || "Failed to load Docker logs");
            });

    };

    useEffect(() => {
        loadLogs();
    }, []);

    if (error) {

        return (
            <div style={{ padding: "20px" }}>

                <h1>📜 Docker Logs</h1>

                <div
                    style={{
                        background: "#300",
                        padding: "20px",
                        borderRadius: "10px",
                        color: "#fff",
                        fontFamily: "monospace"
                    }}
                >
                    Failed to load logs: {error}
                </div>

            </div>
        );

    }

    if (!data) {

        return (
            <div style={{ padding: "20px" }}>
                <h1>📜 Docker Logs</h1>
                <h2>Loading logs...</h2>
            </div>
        );

    }

    return (
        <div style={{ padding: "20px" }}>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px"
                }}
            >

                <h1 style={{ margin: 0 }}>
                    📜 Docker Logs
                </h1>

                <button
                    onClick={loadLogs}
                    style={{
                        padding: "8px 14px",
                        cursor: "pointer"
                    }}
                >
                    🔄 Refresh
                </button>

            </div>

            <p>
                Last 100 lines from <strong>tautweekly-manager</strong>
            </p>

            <div
                style={{
                    background: "#000",
                    color: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    overflowX: "auto",
                    overflowY: "auto",
                    maxHeight: "70vh",
                    fontSize: "13px",
                    lineHeight: "1.5"
                }}
            >
                {data.logs || "No Docker logs available."}
            </div>

        </div>
    );
}
