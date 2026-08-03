from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from datetime import datetime
import os


app = FastAPI(
    title="PlexWeekly-Manager",
    version="0.1.0"
)


@app.get("/api/status")
def status():

    return {
        "application": "PlexWeekly-Manager",
        "status": "online",
        "version": "0.1.0",
        "time": datetime.now().isoformat()
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


if os.path.exists("static"):

    app.mount(
        "/assets",
        StaticFiles(directory="static/assets"),
        name="assets"
    )


@app.get("/{path:path}")
def frontend(path):

    return FileResponse(
        "static/index.html"
    )
