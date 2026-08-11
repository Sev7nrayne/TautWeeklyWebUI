import { useEffect, useState } from "react";
import API from "../services/api";


const SENSITIVE_FIELDS = [
    "ApiKey",
    "PlexToken",
    "SmtpPassword"
];


function displayValue(key,value){

    if(
        SENSITIVE_FIELDS.includes(key)
        &&
        value
    ){
        return "********";
    }

    if(Array.isArray(value)){
        return JSON.stringify(value);
    }

    return String(value ?? "");
}



function Section({icon,title,children}){

    return (
        <div
            style={{
                background:"#1b1b1b",
                padding:"20px",
                marginBottom:"20px",
                borderRadius:"12px"
            }}
        >
            <h2>
                {icon} {title}
            </h2>

            {children}

        </div>
    );

}



function Row({
    label,
    value,
    edit,
    onChange,
    sensitive
}){

    return (

        <div
            style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                gap:"20px",
                padding:"8px 0",
                borderBottom:"1px solid #333"
            }}
        >

            <strong>
                {label}
            </strong>


            {
            edit
            ?
            <input
                type={sensitive ? "password" : "text"}
                placeholder={
                    sensitive
                    ?
                    "Leave unchanged"
                    :
                    ""
                }
                value={value ?? ""}
                onChange={
                    e =>
                    onChange(e.target.value)
                }
                style={{
                    flex:1,
                    maxWidth:"500px"
                }}
            />

            :

            <span>
                {
                    sensitive
                    ?
                    displayValue(label,value)
                    :
                    value
                }
            </span>
            }

        </div>

    );

}





export default function Config(){

const [config,setConfig]=useState(null);

const [editConfig,setEditConfig]=useState(null);

const [editMode,setEditMode]=useState(false);

const [backups,setBackups]=useState([]);

const [message,setMessage]=useState("");

const [users,setUsers]=useState([]);

const [selectedUser,setSelectedUser]=useState("");





async function loadData(){

const cfg =
await API.getTautWeeklyConfig();

setConfig(cfg);

setEditConfig(
    structuredClone(cfg)
);

setBackups(
    await API.getBackups()
);

}



useEffect(()=>{

loadData();

},[]);





function updateField(key, value) {

setEditConfig(prev => ({

    ...prev,
    [key]: value

}));

}





async function loadTautulliUsers(){

setMessage("Loading Tautulli users...");

const result =
await fetch("/api/tautweekly/users")
.then(r=>r.json());


if(result.success){

const emailUsers = result.users.filter(
    u=>u.email
);

setUsers(emailUsers);

if(emailUsers.length > 0 && !selectedUser){
    setSelectedUser(String(emailUsers[0].user_id));
}

setMessage(
    "Tautulli users loaded"
);

}
else{

setMessage(
    result.message || "Failed loading users"
);

}

}





function useSelectedEmail(){

const user =
users.find(
    u=>String(u.user_id) === String(selectedUser)
);


if(user){

setConfig(prev=>({
    ...prev,
    TestEmail:user.email
}));


setEditConfig(prev=>({
    ...prev,
    TestEmail:user.email
}));


setMessage(
    "Test email updated from Tautulli"
);

}

}





async function sendTestEmail(){

setMessage("Sending test email...");

const email = (current.TestEmail || "").trim();
const hasSelectedUser = selectedUser && String(selectedUser).trim() !== "";

let url;

if(hasSelectedUser){
    url = "/api/tautweekly/test-email?user_id=" +
        encodeURIComponent(selectedUser);
}
else if(email){
    url = "/api/tautweekly/test-email?email=" +
        encodeURIComponent(email);
}
else{
    setMessage("❌ Select a Tautulli user or enter an email address");
    return;
}

try{

    const result = await fetch(
        url,
        {method:"POST"}
    ).then(r=>r.json());

    if(result.success){
        setMessage("✅ Test email sent successfully");
    }
    else{
        setMessage(
            "❌ Test email failed: " +
            (result.message || "")
        );
    }

}
catch(error){

    setMessage(
        "❌ Test email failed: " +
        error.message
    );

}

}
async function removeBackup(file){

    if(!confirm("Delete backup: " + file + "?")) return;

    const result = await fetch(
        "/api/tautweekly/backups/" + encodeURIComponent(file),
        { method:"DELETE" }
    ).then(r => r.json());

    if(result.success){
        setMessage("Backup deleted");
        loadData();
    }
    else {
        setMessage("Delete failed: " + result.error);
    }

}


async function restoreBackup(file){

    if(!confirm(
        "Restore this backup?\n\n" +
        file +
        "\n\nThis will replace the current configuration. A safety backup will be created first."
    )) return;

    setMessage("Restoring backup...");

    try {

        const result = await fetch(
            "/api/tautweekly/backups/" +
            encodeURIComponent(file) +
            "/restore",
            { method:"POST" }
        ).then(r => r.json());

        if(result.success){
            setMessage(
                "Backup restored: " +
                file
            );
            await loadData();
        }
        else {
            setMessage(
                "Restore failed: " +
                (result.error || result.message || "")
            );
        }

    }
    catch(error){

        setMessage(
            "Restore failed: " +
            error.message
        );

    }

}


async function createBackup(){

setMessage("Creating backup...");

const result =
await API.createBackup();


if(result.success){

setMessage("Backup created");

loadData();

}

}




function startEdit(){

const editableConfig =
structuredClone(config);

SENSITIVE_FIELDS.forEach(
key=>{
    editableConfig[key] = "";
});

setEditConfig(
editableConfig
);

setEditMode(true);

}



function cancelEdit(){

setEditConfig(
structuredClone(config)
);

setEditMode(false);

}




async function saveConfig(){

const cleanConfig =
structuredClone(editConfig);


SENSITIVE_FIELDS.forEach(
key=>{

if(!cleanConfig[key]){

cleanConfig[key]=config[key];

}

});


const result =
await API.saveTautWeeklyConfig(
cleanConfig
);


if(result.success){

setMessage(
"Configuration saved"
);

setEditMode(false);

loadData();

}
else{

setMessage(
"Save failed: " + result.error
);

}

}





const current =
editMode
?
editConfig
:
config;



if(!config){

return <h2>Loading...</h2>;

}





return (

<div>

<h1>
⚙️ TautWeekly Configuration
</h1>


<button onClick={
editMode
?
cancelEdit
:
startEdit
}>
{
editMode
?
"Cancel Edit"
:
"Edit Configuration"
}
</button>


{
editMode &&
<button
style={{marginLeft:"10px"}}
onClick={saveConfig}
>
Save Changes
</button>
}


<p>{message}</p>





<Section icon="💾" title="Backups">

<button onClick={createBackup}>
Create Config Backup
</button>



{
backups.map(
file =>
<div key={file}>

<Row
label="Backup"
value={file}
/>

<div style={{display:"flex",gap:"8px",marginTop:"6px"}}>

<button
onClick={() => restoreBackup(file)}
>
↩️ Restore
</button>

<button
onClick={() => removeBackup(file)}
>
🗑️ Delete
</button>

</div>

</div>
)
}


</Section>





<Section icon="🎬" title="Plex">


{
[
"ServerLabel",
"PlexWebUrl",
"PlexServerUrl",
"PlexToken"
].map(key=>

<Row
key={key}
label={key}
value={current[key]}
sensitive={
key==="PlexToken"
}
edit={editMode}
onChange={
v=>updateField(key,v)
}
/>

)

}

</Section>





<Section icon="📊" title="Tautulli">


<Row
label="TautulliUrl"
value={current.TautulliUrl}
edit={editMode}
onChange={
v=>updateField("TautulliUrl",v)
}
/>


<Row
label="ApiKey"
value={current.ApiKey}
sensitive
edit={editMode}
onChange={
v=>updateField("ApiKey",v)
}
/>


<button onClick={loadTautulliUsers}>
Load Tautulli Users
</button>


<select
value={selectedUser}
onChange={
e=>setSelectedUser(e.target.value)
}
>

<option value="">
Select user
</option>

{
users.map(
u=>
<option
key={u.user_id}
value={u.user_id}
>
{u.friendly_name || u.username} - {u.email}
</option>
)
}

</select>


<button onClick={useSelectedEmail}>
Use Selected Email
</button>


</Section>






<Section icon="📧" title="Email / SMTP">


{
[
"FromName",
"FromEmail",
"ReplyToEmail",
"SmtpHost",
"SmtpPort",
"SmtpUsername",
"SmtpPassword"

].map(key=>

<Row
key={key}
label={key}
value={current[key]}
sensitive={
SENSITIVE_FIELDS.includes(key)
}
edit={editMode}
onChange={
v=>updateField(key,v)
}
/>

)

}


<div style={{padding:"12px 0",borderBottom:"1px solid #333"}}>
<strong>TestEmail</strong>
<input
type="email"
value={current.TestEmail || ""}
onChange={e=>{setSelectedUser("");updateField("TestEmail",e.target.value)}}
disabled={!editMode}
placeholder="Enter any email address"
style={{display:"block",marginTop:"8px",width:"100%",maxWidth:"500px",padding:"8px"}}
/>
<button
onClick={sendTestEmail}
style={{marginTop:"12px",padding:"10px 16px"}}
>
Send TautWeekly Test Email
</button>
</div>


</Section>



<Section icon="⏰" title="Scheduler">


{
[
"ScheduleEnabled",
"ScheduleDay",
"ScheduleTime",
"ScheduleGraceMinutes",
"SchedulerPollSeconds"

].map(key=>

<Row
key={key}
label={key}
value={current[key]}
edit={editMode}
onChange={
v=>updateField(key,v)
}
/>

)

}

</Section>





<Section icon="📰" title="Newsletter Settings">


{
[
"FooterServerName",
"DaysBack",
"WatchedPercent",
"MinimumEpisodeSeconds",
"MaxMovies",
"MaxTv",
"RecentAccessDays",
"SendDelaySeconds"

].map(key=>

<Row
key={key}
label={key}
value={current[key]}
edit={editMode}
onChange={
v=>updateField(key,v)
}
/>

)

}

</Section>


</div>

);


}
