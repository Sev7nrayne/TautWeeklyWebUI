import os
import json
import requests
from datetime import datetime


CONFIG="/tautweekly/data/config.json"


def get_config():
    try:
        with open(CONFIG,"r") as f:
            return json.load(f)
    except Exception:
        return {}


def check_plex():

    config=get_config()

    url=config.get("PlexServerUrl")
    token=config.get("PlexToken")

    if not url or not token:
        return {
            "status":"warning",
            "message":"Not configured"
        }

    try:
        r=requests.get(
            url.rstrip("/") + "/identity",
            headers={
                "X-Plex-Token":token
            },
            timeout=5
        )

        if r.status_code == 200:
            return {
                "status":"online",
                "message":"Connected"
            }

        return {
            "status":"offline",
            "message":f"HTTP {r.status_code}"
        }

    except Exception as e:
        return {
            "status":"offline",
            "message":str(e)
        }


def check_tautulli():

    config=get_config()

    url=config.get("TautulliUrl")
    key=config.get("ApiKey")

    if not url or not key:
        return {
            "status":"warning",
            "message":"Not configured"
        }

    try:

        url=url.rstrip("/")

        if not url.endswith("/api/v2"):
            url += "/api/v2"


        r=requests.get(
            url,
            params={
                "apikey":key,
                "cmd":"status"
            },
            timeout=5
        )


        data=r.json()


        if data.get("response",{}).get("result") == "success":
            return {
                "status":"online",
                "message":"API Connected"
            }


        return {
            "status":"offline",
            "message":"API authentication failed"
        }


    except ValueError:
        return {
            "status":"offline",
            "message":"Invalid API response"
        }

    except Exception as e:
        return {
            "status":"offline",
            "message":str(e)
        }



def check_tautweekly():

    if os.path.exists("/tautweekly"):
        return {
            "status":"online",
            "message":"Installed"
        }

    return {
        "status":"offline",
        "message":"Missing"
    }



def service_health():

    return {
        "checked":datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "plex":check_plex(),
        "tautulli":check_tautulli(),
        "tautweekly":check_tautweekly()
    }
