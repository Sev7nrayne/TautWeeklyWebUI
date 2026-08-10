#!/bin/bash
set -e

FILE="frontend/src/pages/Config.jsx"

cp "$FILE" "$FILE.backup-before-delete-button"

echo "Adding delete backup function..."

sed -i '/async function createBackup()/i\
\
async function removeBackup(file){\
\
    if(!confirm("Delete backup: " + file + "?")) return;\
\
    const result = await fetch(\
        "/api/plexweekly/backups/" + encodeURIComponent(file),\
        { method:"DELETE" }\
    ).then(r => r.json());\
\
    if(result.success){\
        setMessage("Backup deleted");\
        loadData();\
    }\
    else {\
        setMessage("Delete failed: " + result.error);\
    }\
\
}\
\
' "$FILE"


echo "Replacing backup display..."

python3=$(which python3 || true)

if [ -z "$python3" ]; then
    echo "python3 missing - using perl"
    
    perl -0777 -i -pe '
s#\{\s*backups\.map\(\s*file=>\s*<Row\s*key=\{file\}\s*label="Backup"\s*value=\{file\}\s*/>\s*\)\s*\}#
{
backups.map(
file =>
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
#s' "$FILE"

else

python3 - <<'PY'
from pathlib import Path

p=Path("frontend/src/pages/Config.jsx")

data=p.read_text()

old='''{
backups.map(
file=>
<Row
key={file}
label="Backup"
value={file}
/>
)
}
'''

new='''{
backups.map(
file =>
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
'''

if old not in data:
    raise Exception("Backup JSX block not found")

data=data.replace(old,new)

p.write_text(data)
PY

fi

echo "Done"
