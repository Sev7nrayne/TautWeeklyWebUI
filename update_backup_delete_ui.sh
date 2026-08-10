#!/bin/bash
set -e

BASE="/mnt/user/docker/PlexWeekly-Manager"

echo "Backing up frontend files..."

cp "$BASE/frontend/src/services/api.js" \
"$BASE/frontend/src/services/api.js.backup-delete"

cp "$BASE/frontend/src/pages/Config.jsx" \
"$BASE/frontend/src/pages/Config.jsx.backup-delete"


echo "Updating api.js..."

cat > "$BASE/frontend/src/services/api.js" <<'JSEOF'
const API = {

    async getPlexWeeklyConfig(){

        const r = await fetch(
            "/api/plexweekly/config"
        );

        return await r.json();

    },


    async savePlexWeeklyConfig(config){

        const r = await fetch(
            "/api/plexweekly/config/save",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(config)
            }
        );

        return await r.json();

    },


    async getBackups(){

        const r = await fetch(
            "/api/plexweekly/backups"
        );

        return await r.json();

    },


    async createBackup(){

        const r = await fetch(
            "/api/plexweekly/backup",
            {
                method:"POST"
            }
        );

        return await r.json();

    }

};


export async function deleteBackup(filename){

    const r = await fetch(
        "/api/plexweekly/backups/" +
        encodeURIComponent(filename),
        {
            method:"DELETE"
        }
    );

    return await r.json();

}


export default API;
JSEOF


echo "Patching Config.jsx..."

python3 - <<'PY'
from pathlib import Path

p=Path("frontend/src/pages/Config.jsx")

data=p.read_text()


data=data.replace(
'import API from "../services/api";',
'import API, { deleteBackup } from "../services/api";'
)


marker="async function createBackup(){"

insert="""

async function removeBackup(file){

    if(!confirm("Delete backup: " + file + "?")){
        return;
    }


    const result =
    await deleteBackup(file);


    if(result.success){

        setMessage("Backup deleted");

        loadData();

    }
    else{

        setMessage(
            "Delete failed: " +
            result.error
        );

    }

}

"""


if "async function removeBackup" not in data:
    data=data.replace(
        marker,
        insert + marker
    )


old="""
{
backups.map(
file=>
<Row
key={file}
label="Backup"
value={file}
/>
)
}
"""


new="""
{
backups.map(
file=>
<div key={file}>

<Row
label="Backup"
value={file}
/>

<button
onClick={() => removeBackup(file)}
>
🗑️ Delete
</button>

</div>
)
}
"""


if old in data:
    data=data.replace(old,new)


p.write_text(data)

PY


echo "Backup delete UI installed"
