import os


TAUTWEEKLY_LOG_PATH = "/tautweekly/data/logs"


def get_logs(limit=200):

    if not os.path.exists(TAUTWEEKLY_LOG_PATH):

        return {
            "error": "Log directory not found",
            "logs": []
        }


    files = sorted(
        os.listdir(TAUTWEEKLY_LOG_PATH),
        reverse=True
    )


    output = []


    for file in files:

        if not file.endswith(".log"):

            continue


        path = os.path.join(
            TAUTWEEKLY_LOG_PATH,
            file
        )


        try:

            with open(
                path,
                "r",
                errors="ignore"
            ) as f:

                lines = f.readlines()


            output.extend(
                [
                    {
                        "file": file,
                        "line": line.rstrip()
                    }

                    for line in lines[-limit:]
                ]
            )


        except Exception as e:

            output.append(
                {
                    "file": file,
                    "line": str(e)
                }
            )


    return {
        "count": len(output),
        "logs": output[-limit:]
    }
