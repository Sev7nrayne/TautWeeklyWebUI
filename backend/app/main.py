from services.health import service_health
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from datetime import datetime
import os

from services import tautweekly
from services import logs
from services import scheduler
from services import backup
from services import tautulli
from services.config_manager import save_config, validate_config
from services.config_schema import CONFIG_SCHEMA


app = FastAPI(
    title="TautWeekly-Manager",
    version="0.1.0"
)


# -------------------------
# Basic API
# -------------------------

@app.get("/api/status")
def status():

    return {
        "application": "TautWeekly-Manager",
        "status": "online",
        "version": "0.1.0",
        "time": datetime.now().isoformat()
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# -------------------------
# TautWeekly Integration
# -------------------------

@app.get("/api/tautweekly/status")
def tautweekly_status():

    return tautweekly.get_status()


@app.get("/api/tautweekly/config")
def tautweekly_config():

    config = tautweekly.get_config()

    if config is None:

        return {
            "error": "config.json not found"
        }

    return config


@app.get("/api/tautweekly/schema")
def tautweekly_schema():

    return CONFIG_SCHEMA


@app.get("/api/tautweekly/logs")
def tautweekly_logs():

    return logs.get_logs()


@app.get("/api/tautweekly/scheduler")
def tautweekly_scheduler():

    return scheduler.get_scheduler_status()


@app.post("/api/tautweekly/backup")
def tautweekly_backup():

    return backup.create_backup()


@app.get("/api/tautweekly/backups")
def tautweekly_backups():

    return backup.list_backups()


# -------------------------
# Tautulli Users
# -------------------------

@app.get("/api/tautweekly/users")
def tautweekly_users():

    return tautulli.get_users()


# -------------------------
# TautWeekly Test Email
# -------------------------

@app.post("/api/tautweekly/test-email")
def tautweekly_test_email(
    user_id: str = None,
    email: str = None
):

    return tautweekly.send_test_email(
        user_id=user_id,
        email=email
    )



# -------------------------
# Config Save
# -------------------------

@app.post("/api/tautweekly/config/save")
def save_tautweekly_config(config: dict):

    try:

        validation = validate_config(
            config
        )

        if not validation["valid"]:

            return {
                "success": False,
                "error": validation["error"]
            }


        save_config(
            config
        )


        return {
            "success": True,
            "message": "Configuration saved"
        }


    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }


# -------------------------
# -------------------------
# Service Health Checks
# -------------------------

@app.get("/api/health/services")
def health_services():

    return service_health()


# React Frontend
# -------------------------

if os.path.exists("static/assets"):

    app.mount(
        "/assets",
        StaticFiles(directory="static/assets"),
        name="assets"
    )





@app.delete("/api/tautweekly/backups/{filename}")
def delete_tautweekly_backup(filename: str):

    return backup.delete_backup(filename)



@app.delete("/api/tautweekly/backups/{filename}")
def delete_backup(filename: str):

    return backup.delete_backup(filename)



# -------------------------
# Delete TautWeekly Backup
# -------------------------

from fastapi import HTTPException
from urllib.parse import unquote


@app.delete("/api/tautweekly/backups/{filename}")
def delete_backup(filename: str):

    filename = unquote(filename)

    backup_dir = "/tautweekly/data/backups"

    import os

    target = os.path.join(
        backup_dir,
        filename
    )

    if not os.path.exists(target):

        return {
            "success": False,
            "error": "Backup not found"
        }


    if not os.path.isfile(target):

        return {
            "success": False,
            "error": "Invalid backup file"
        }


    os.remove(target)


    return {
        "success": True,
        "message": "Backup deleted",
        "file": filename
    }



@app.get("/api/logs")
def docker_logs():
    import subprocess

    try:
        result = subprocess.run(
            ["docker", "logs", "--tail", "100", "TautWeekly-WebUI"],
            capture_output=True,
            text=True,
            timeout=10
        )

        logs = result.stdout

        if result.stderr:
            logs += result.stderr

        return {
            "count": len(logs.splitlines()),
            "logs": logs
        }

    except Exception as e:
        return {
            "count": 0,
            "logs": "",
            "error": str(e)
        }

# -------------------------
# React Frontend Catch-All
# -------------------------

@app.get("/{path:path}")
def frontend(path):

    return FileResponse(
        "static/index.html"
    )
