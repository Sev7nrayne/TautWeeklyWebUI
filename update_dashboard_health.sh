#!/bin/bash
set -e

BASE="/mnt/user/docker/TautWeekly-Manager"

echo "Backing up Dashboard.jsx..."

cp "$BASE/frontend/src/pages/Dashboard.jsx" \
"$BASE/frontend/src/pages/Dashboard.jsx.backup-health"


echo "Replacing Dashboard.jsx..."

cat > "$BASE/frontend/src/pages/Dashboard.jsx" <<'EOF2'
import { useEffect, useState } from "react";
import { getServiceHealth } from "../services/api";
import StatusCard from "../components/StatusCard";


export default function Dashboard() {

    const [health, setHealth] = useState(null);
    const [error, setError] = useState(null);


    async function loadHealth() {
        try {
            const data = await getServiceHealth();
            setHealth(data);
        } catch (err) {
            setError(err.message);
        }
    }


    useEffect(() => {
        loadHealth();

        const timer = setInterval(loadHealth, 30000);

        return () => clearInterval(timer);
    }, []);


    if (error) {
        return (
            <div>
                <h2>Dashboard</h2>
                <p>Health check error: {error}</p>
            </div>
        );
    }


    if (!health) {
        return (
            <div>
                <h2>Dashboard</h2>
                <p>Loading health status...</p>
            </div>
        );
    }


    return (
        <div>

            <h2>Dashboard</h2>

            <div className="status-grid">

                <StatusCard
                    title="Plex"
                    icon="🎬"
                    status={health.plex.status}
                    message={health.plex.message}
                />


                <StatusCard
                    title="Tautulli"
                    icon="📊"
                    status={health.tautulli.status}
                    message={health.tautulli.message}
                />


                <StatusCard
                    title="TautWeekly"
                    icon="📨"
                    status={health.tautweekly.status}
                    message={health.tautweekly.message}
                />

            </div>


            <br />

            <div>
                <small>
                    Last checked: {health.checked}
                </small>
            </div>

        </div>
    );
}
EOF2


echo "Done."
echo ""
echo "Rebuild frontend with:"
echo "docker compose down"
echo "docker compose build --no-cache"
echo "docker compose up -d"

