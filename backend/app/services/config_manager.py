import json
import os
import tempfile

from services import backup


CONFIG_PATH = "/plexweekly/data/config.json"



def get_config():

    if not os.path.exists(CONFIG_PATH):

        return None


    with open(CONFIG_PATH, "r") as f:

        return json.load(f)





def validate_config(config):

    if not isinstance(config, dict):

        return {
            "valid": False,
            "error": "Configuration must be an object"
        }


    required = [
        "PlexServerUrl",
        "PlexToken",
        "SmtpHost"
    ]


    missing = []


    for key in required:

        if key not in config or not config[key]:

            missing.append(key)



    if missing:

        return {
            "valid": False,
            "error": (
                "Missing required fields: "
                +
                ", ".join(missing)
            )
        }



    return {
        "valid": True
    }







def preserve_secrets(new_config):

    current = get_config()


    if not current:

        return new_config



    sensitive = [
        "ApiKey",
        "PlexToken",
        "SmtpPassword"
    ]



    for key in sensitive:


        if (
            key in new_config
            and
            (
                new_config[key] == ""
                or
                new_config[key] is None
            )
        ):

            new_config[key] = current.get(key)



    return new_config







def save_config(config):


    validation = validate_config(
        config
    )


    if not validation["valid"]:

        raise Exception(
            validation["error"]
        )



    config = preserve_secrets(
        config
    )



    backup.create_backup()



    directory = os.path.dirname(
        CONFIG_PATH
    )



    fd, temp_path = tempfile.mkstemp(
        dir=directory,
        prefix="config.",
        suffix=".tmp"
    )



    try:


        with os.fdopen(fd,"w") as f:

            json.dump(
                config,
                f,
                indent=2
            )



        os.replace(
            temp_path,
            CONFIG_PATH
        )


    finally:


        if os.path.exists(temp_path):

            os.remove(temp_path)



    return True
