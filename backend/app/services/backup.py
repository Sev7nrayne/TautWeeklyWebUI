import os
import shutil
from datetime import datetime

CONFIG_PATH = "/tautweekly/data/config.json"
BACKUP_PATH = "/tautweekly/data/backups"

MAX_BACKUPS = 2


def _get_backups():
    if not os.path.exists(BACKUP_PATH):
        return []

    backups = []

    for filename in os.listdir(BACKUP_PATH):
        if (
            filename.startswith("config.json.")
            and filename.endswith(".bak")
        ):
            path = os.path.join(BACKUP_PATH, filename)

            if os.path.isfile(path):
                backups.append(filename)

    return sorted(backups, reverse=True)


def _enforce_retention():
    backups = _get_backups()

    for old_backup in backups[MAX_BACKUPS:]:
        try:
            os.remove(
                os.path.join(BACKUP_PATH, old_backup)
            )
        except OSError:
            pass

    return _get_backups()


def _create_backup_file():
    os.makedirs(BACKUP_PATH, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")

    backup_file = os.path.join(
        BACKUP_PATH,
        f"config.json.{timestamp}.bak"
    )

    # Avoid overwriting a backup if two operations happen
    # during the same second.
    counter = 1

    while os.path.exists(backup_file):
        backup_file = os.path.join(
            BACKUP_PATH,
            f"config.json.{timestamp}-{counter}.bak"
        )
        counter += 1

    shutil.copy2(
        CONFIG_PATH,
        backup_file
    )

    return os.path.basename(backup_file)


def create_backup():
    if not os.path.exists(CONFIG_PATH):
        return {
            "success": False,
            "error": "config.json not found"
        }

    backup_file = _create_backup_file()

    _enforce_retention()

    return {
        "success": True,
        "backup": backup_file
    }


def list_backups():
    return _get_backups()


def delete_backup(filename):
    if not filename:
        return {
            "success": False,
            "error": "Filename required"
        }

    if (
        not filename.startswith("config.json.")
        or not filename.endswith(".bak")
    ):
        return {
            "success": False,
            "error": "Invalid backup filename"
        }

    backup_file = os.path.join(
        BACKUP_PATH,
        filename
    )

    if not os.path.exists(backup_file):
        return {
            "success": False,
            "error": "Backup not found"
        }

    if not os.path.isfile(backup_file):
        return {
            "success": False,
            "error": "Invalid backup"
        }

    os.remove(backup_file)

    return {
        "success": True,
        "deleted": filename
    }


def restore_backup(filename):
    if not filename:
        return {
            "success": False,
            "error": "Filename required"
        }

    if (
        not filename.startswith("config.json.")
        or not filename.endswith(".bak")
    ):
        return {
            "success": False,
            "error": "Invalid backup filename"
        }

    backup_file = os.path.join(
        BACKUP_PATH,
        filename
    )

    if not os.path.exists(backup_file):
        return {
            "success": False,
            "error": "Backup not found"
        }

    if not os.path.isfile(backup_file):
        return {
            "success": False,
            "error": "Invalid backup"
        }

    if not os.path.exists(CONFIG_PATH):
        return {
            "success": False,
            "error": "Current config.json not found"
        }

    # Always protect the current configuration before restoring.
    safety_backup = _create_backup_file()

    # Restore the selected configuration.
    shutil.copy2(
        backup_file,
        CONFIG_PATH
    )

    # Keep only the two newest backups.
    _enforce_retention()

    return {
        "success": True,
        "restored": filename,
        "safety_backup": safety_backup
    }
