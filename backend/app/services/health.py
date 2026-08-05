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
