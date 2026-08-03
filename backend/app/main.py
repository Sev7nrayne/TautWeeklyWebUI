from fastapi import FastAPI
from datetime import datetime


app = FastAPI(
    title="PlexWeekly-Manager",
    version="0.1.0"
)


@app.get("/")
def home():

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
