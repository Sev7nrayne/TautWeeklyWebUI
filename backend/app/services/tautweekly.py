import json
import os
import subprocess
import datetime

TAUTWEEKLY_PATH = "/tautweekly"


def get_status():

    data = {
        "installed": False,
        "config_exists": False,
        "logs_exists": False
    }

    if os.path.exists(TAUTWEEKLY_PATH):
        data["installed"] = True

    config = os.path.join(
        TAUTWEEKLY_PATH,
        "data",
        "config.json"
    )

    if os.path.exists(config):
        data["config_exists"] = True

    logs = os.path.join(
        TAUTWEEKLY_PATH,
        "data",
        "logs"
    )

    if os.path.exists(logs):
        data["logs_exists"] = True

    return data


def get_config():

    config_file = os.path.join(
        TAUTWEEKLY_PATH,
        "data",
        "config.json"
    )

    if not os.path.exists(config_file):
        return None

    with open(config_file, "r") as f:
        return json.load(f)


def send_test_email(user_id=None):

    live_logs = []

    def log(msg):

        timestamp = datetime.datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        line = f"[{timestamp}] {msg}"

        live_logs.append(line)

        print(line, flush=True)

    # -------------------------------------------------
    # Tautulli user path
    # -------------------------------------------------

    if user_id:

        try:

            log(
                f"Starting TautWeekly SendTest for user {user_id}"
            )

            cmd = [
                "docker",
                "exec",
                "plexweekly",
                "pwsh",
                "-NoProfile",
                "-File",
                "/opt/plexweekly/PlexWeekly.ps1",
                "-Mode",
                "SendTest",
                "-UserId",
                str(user_id)
            ]

            log("Launching PlexWeekly SendTest")

            process = subprocess.Popen(
                cmd,
                cwd="/tautweekly",
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )

            log("Waiting for PlexWeekly output...")

            for line in process.stdout:

                line = line.strip()

                if line:
                    log(line)

            process.wait()

            if process.returncode != 0:

                log("TautWeekly SendTest failed")

                return {
                    "success": False,
                    "message": "SendTest failed",
                    "logs": live_logs
                }

            log("TautWeekly SendTest completed successfully")

            return {
                "success": True,
                "message": "Test email sent successfully",
                "logs": live_logs
            }

        except Exception as e:

            log(f"ERROR: {str(e)}")

            return {
                "success": False,
                "message": str(e),
                "logs": live_logs
            }

    # -------------------------------------------------

    # No manual email sending.
    # Test emails must target a selected Tautulli user.
    return {
        "success": False,
        "message": "Select a Tautulli user with an email address",
        "logs": live_logs
    }
