import json
import os


PLEXWEEKLY_PATH = "/plexweekly"


def get_status():

    data = {

        "installed": False,
        "config_exists": False,
        "logs_exists": False

    }


    if os.path.exists(PLEXWEEKLY_PATH):

        data["installed"] = True


    config = os.path.join(
        PLEXWEEKLY_PATH,
        "data",
        "config.json"
    )


    if os.path.exists(config):

        data["config_exists"] = True


    logs = os.path.join(
        PLEXWEEKLY_PATH,
        "data",
        "logs"
    )


    if os.path.exists(logs):

        data["logs_exists"] = True


    return data



def get_config():

    config_file = os.path.join(
        PLEXWEEKLY_PATH,
        "data",
        "config.json"
    )


    if not os.path.exists(config_file):

        return None


    with open(config_file,"r") as f:

        return json.load(f)
