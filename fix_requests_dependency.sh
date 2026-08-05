#!/bin/bash
set -e

FILE="backend/requirements.txt"

if ! grep -q "^requests" "$FILE"; then
    echo "Adding requests dependency..."
    echo "requests" >> "$FILE"
else
    echo "requests already exists"
fi

echo "Rebuilding container..."

docker compose down
docker compose build --no-cache
docker compose up -d

echo "Done"
