#!/bin/bash
set -e

FILE="backend/app/main.py"

echo "Backing up main.py..."
cp "$FILE" "$FILE.backup-health-route2"

echo "Removing old health route..."

sed -i '/@app.get("\/api\/health\/services")/,/return service_health()/d' "$FILE"


echo "Inserting health route before frontend..."

sed -i '/# React Frontend/i\
# -------------------------\
# Service Health Checks\
# -------------------------\
\
@app.get("/api/health/services")\
def health_services():\
\
    return service_health()\
\
' "$FILE"

echo "Done"

