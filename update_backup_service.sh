#!/bin/bash
set -e

FILE="backend/app/services/backup.py"

cp "$FILE" "$FILE.backup-delete"

cat >> "$FILE" <<'PYEOF'


def delete_backup(filename):

    if not filename:
        return {
            "success": False,
            "error": "Missing filename"
        }


    path = os.path.join(
        BACKUP_PATH,
        filename
    )


    if not os.path.exists(path):
        return {
            "success": False,
            "error": "Backup not found"
        }


    if not os.path.isfile(path):
        return {
            "success": False,
            "error": "Invalid backup"
        }


    os.remove(path)


    return {
        "success": True,
        "deleted": filename
    }

PYEOF

echo "backup.py updated"
