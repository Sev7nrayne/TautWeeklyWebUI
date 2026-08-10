#!/bin/bash
set -e

FILE="backend/app/main.py"

cp "$FILE" "$FILE.backup-delete-api"

echo "Adding backup delete API..."

cat >> "$FILE" <<'PYEOF'


# -------------------------
# Delete PlexWeekly Backup
# -------------------------

from fastapi import HTTPException
from urllib.parse import unquote


@app.delete("/api/plexweekly/backups/{filename}")
def delete_backup(filename: str):

    filename = unquote(filename)

    backup_dir = "/plexweekly/data/backups"

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

PYEOF

echo "Backup delete API added"
