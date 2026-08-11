import json
import os
import subprocess
import datetime
import smtplib
from email.message import EmailMessage

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


def send_test_email(user_id=None, email=None):

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
    # Manual email path
    # -------------------------------------------------

    if email:

        try:

            config = get_config()

            if not config:

                return {
                    "success": False,
                    "message": "TautWeekly config not found",
                    "logs": live_logs
                }

            smtp_host = config.get("SmtpHost")
            smtp_port = int(config.get("SmtpPort", 587))
            smtp_username = config.get("SmtpUsername")
            smtp_password = config.get("SmtpPassword")
            from_email = config.get("FromEmail") or smtp_username

            if not smtp_host:
                raise ValueError("SmtpHost is not configured")

            if not smtp_username:
                raise ValueError("SmtpUsername is not configured")

            if not smtp_password:
                raise ValueError("SmtpPassword is not configured")

            if not from_email:
                raise ValueError("FromEmail is not configured")

            log(f"Sending SMTP test to {email}")
            log(f"SMTP server: {smtp_host}:{smtp_port}")

            message = EmailMessage()

            message["From"] = from_email
            message["To"] = email
            message["Subject"] = "TautWeekly SMTP Test"

            message.set_content(
                "This is a test email from TautWeekly WebUI.\n\n"
                "SMTP configuration is working correctly."
            )

            with smtplib.SMTP(
                smtp_host,
                smtp_port,
                timeout=30
            ) as smtp:

                smtp.ehlo()
                smtp.starttls()
                smtp.ehlo()

                smtp.login(
                    smtp_username,
                    smtp_password
                )

                smtp.send_message(message)

            log("Manual SMTP test email sent successfully")

            return {
                "success": True,
                "message": "Test email sent successfully",
                "logs": live_logs
            }

        except Exception as e:

            log(f"SMTP ERROR: {str(e)}")

            return {
                "success": False,
                "message": str(e),
                "logs": live_logs
            }

    return {
        "success": False,
        "message": "Tautulli user or email address required",
        "logs": live_logs
    }
