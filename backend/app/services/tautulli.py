import json
import urllib.request
import urllib.parse

from services.config_manager import get_config


def get_users():

    config = get_config()

    if not config:

        return {
            "success": False,
            "message": "TautWeekly config not found"
        }


    tautulli_url = config.get("TautulliUrl")
    api_key = config.get("ApiKey")


    if not tautulli_url or not api_key:

        return {
            "success": False,
            "message": "Tautulli is not configured"
        }


    try:

        params = urllib.parse.urlencode(
            {
                "apikey": api_key,
                "cmd": "get_users"
            }
        )


        url = (
            tautulli_url.rstrip("/")
            +
            "/api/v2?"
            +
            params
        )


        with urllib.request.urlopen(
            url,
            timeout=10
        ) as response:

            data = json.loads(
                response.read().decode("utf-8")
            )


        if data.get("response", {}).get("result") != "success":

            return {
                "success": False,
                "message": "Tautulli API error"
            }


        users = []


        for user in data["response"]["data"]:

            users.append(
                {
                    "user_id": user.get("user_id"),
                    "username": user.get("username"),
                    "friendly_name": user.get("friendly_name"),
                    "email": user.get("email")
                }
            )


        return {
            "success": True,
            "users": users
        }


    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
