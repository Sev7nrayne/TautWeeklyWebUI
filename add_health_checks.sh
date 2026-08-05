#!/bin/bash
set -e

BASE="/mnt/user/docker/PlexWeekly-Manager"

echo "Creating health service..."

cat > "$BASE/backend/app/services/health.py" <<'PYEOF'
import os
import requests
from datetime import datetime


def check_plex():
    url = os.getenv("PLEX_URL")
    token = os.getenv("PLEX_TOKEN")

    if not url or not token:
        return {
            "status": "warning",
            "message": "Not configured"
        }

    try:
        r = requests.get(
            f"{url}/identity",
            headers={"X-Plex-Token": token},
            timeout=5
        )

        return {
            "status": "online" if r.status_code == 200 else "offline",
            "message": "Connected" if r.status_code == 200 else f"HTTP {r.status_code}"
        }

    except Exception as e:
        return {
            "status": "offline",
            "message": str(e)
        }


def check_tautulli():
    url = os.getenv("TAUTULLI_URL")
    key = os.getenv("TAUTULLI_API_KEY")

    if not url or not key:
        return {
            "status": "warning",
            "message": "Not configured"
        }

    try:
        r = requests.get(
            url,
            params={
                "apikey": key,
                "cmd": "status"
            },
            timeout=5
        )

        data = r.json()

        if data.get("response", {}).get("result") == "success":
            return {
                "status": "online",
                "message": "API Connected"
            }

        return {
            "status": "offline",
            "message": "API Error"
        }

    except Exception as e:
        return {
            "status": "offline",
            "message": str(e)
        }


def check_plexweekly():
    if os.path.exists("/plexweekly"):
        return {
            "status": "online",
            "message": "Installed"
        }

    return {
        "status": "offline",
        "message": "Missing"
    }


def service_health():
    return {
        "checked": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "plex": check_plex(),
        "tautulli": check_tautulli(),
        "plexweekly": check_plexweekly()
    }
PYEOF


echo "Adding API route..."

python3 <<'PY'
from pathlib import Path

p = Path("backend/app/main.py")
data = p.read_text()

if "services.health import service_health" not in data:
    data = data.replace(
        "from app.services.",
        "from app.services.health import service_health\nfrom app.services."
    )

if "/api/health/services" not in data:
    data += """

@app.get("/api/health/services")
def health_services():
    return service_health()
"""

p.write_text(data)
PY


echo "Updating frontend API..."

python3 <<'PY'
from pathlib import Path

p = Path("frontend/src/services/api.js")
data = p.read_text()

if "getServiceHealth" not in data:
    data += """

export async function getServiceHealth() {
    const res = await fetch("/api/health/services");
    return await res.json();
}
"""

p.write_text(data)
PY


echo "Done."
echo "Rebuild with:"
echo "docker compose down && docker compose build --no-cache && docker compose up -d"
