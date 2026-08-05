#!/bin/bash
set -e

BASE="/mnt/user/docker/PlexWeekly-Manager"

echo "Fixing health import..."

sed -i 's/from app\.services\.health import service_health/from services.health import service_health/' \
"$BASE/backend/app/main.py"

echo "Checking import:"
grep health "$BASE/backend/app/main.py"

echo "Rebuilding container..."

docker compose down
docker compose build --no-cache
docker compose up -d

echo "Done"
