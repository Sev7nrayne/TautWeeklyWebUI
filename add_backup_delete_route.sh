#!/bin/bash
set -e

FILE="backend/app/main.py"

cp "$FILE" "$FILE.backup-delete-route"


cat >> "$FILE" <<'PYEOF'


@app.delete("/api/plexweekly/backups/{filename}")
def delete_backup(filename: str):

    return backup.delete_backup(filename)

PYEOF


echo "API delete route added"
