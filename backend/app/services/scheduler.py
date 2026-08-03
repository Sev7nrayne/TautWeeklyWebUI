import os
import json
from datetime import datetime


SCHEDULER_PATH = "/plexweekly/data"



def read_json(filename):

    path = os.path.join(
        SCHEDULER_PATH,
        filename
    )


    if not os.path.exists(path):

        return None


    try:

        with open(path,"r") as f:

            return json.load(f)


    except Exception:

        return None




def get_scheduler_status():


    heartbeat = read_json(
        "scheduler-heartbeat.json"
    )


    state = read_json(
        "state.json"
    )


    return {

        "heartbeat_exists":
            heartbeat is not None,


        "heartbeat":
            heartbeat,


        "state":
            state,


        "checked":
            datetime.now().isoformat()

    }
