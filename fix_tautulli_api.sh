#!/bin/bash
set -e

FILE="backend/app/services/health.py"

cp "$FILE" "$FILE.backup-tautulli"

sed -i '/r = requests.get(/i\
        # Tautulli API requires /api/v2\
        if not url.endswith("/api/v2"):\\
            url = url.rstrip("/") + "/api/v2"\
' "$FILE"

echo "Tautulli API path patch applied"
