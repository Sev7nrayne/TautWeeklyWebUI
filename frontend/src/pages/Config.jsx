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

            sensitive

            ?

            <input

                type="password"

                placeholder="Leave unchanged"

                onChange={
                    e =>
                    onChange(
                        e.target.value
                    )
                }

                style={{
                    flex:1,
                    maxWidth:"500px"
                }}

            />

            :

            <input

                value={value ?? ""}

                onChange={
                    e =>
                    onChange(
                        e.target.value
                    )
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
                    displayValue(
                        label === "API Key"
                        ?
                        "ApiKey"
                        :
                        label,
                        value
                    )
                    :
                    value
                }
            </span>

            }


        </div>

    );

}








export default function Config(){


const [config,setConfig] =
useState(null);


const [editConfig,setEditConfig] =
useState(null);


const [editMode,setEditMode] =
useState(false);


const [backups,setBackups] =
useState([]);


const [message,setMessage] =
useState("");





async function loadData(){


const cfg =
await API.getPlexWeeklyConfig();


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






function updateField(key,value){


setEditConfig({

...editConfig,

[key]:value

});


}








async function createBackup(){


setMessage(
"Creating backup..."
);


const result =
await API.createBackup();



if(result.success){

setMessage(
"Backup created"
);


loadData();

}


}








function startEdit(){

setEditConfig(
structuredClone(config)
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


setMessage(
"Saving configuration..."
);



const cleanConfig =
structuredClone(editConfig);



SENSITIVE_FIELDS.forEach(
key=>{


if(
!cleanConfig[key]
){

cleanConfig[key]=config[key];

}


});





const result =
await API.savePlexWeeklyConfig(
cleanConfig
);



if(result.success){

setMessage(
"Configuration saved successfully"
);


setEditMode(false);


loadData();

}
else{


setMessage(
"Save failed: " +
(result.error || "")
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
⚙️ PlexWeekly Configuration
</h1>



<button
onClick={
editMode
?
cancelEdit
:
startEdit
}
>

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

style={{
marginLeft:"10px"
}}

onClick={saveConfig}

>

Save Changes

</button>

}



<p>
{message}
</p>





<Section
icon="💾"
title="Backups"
>


<button
onClick={createBackup}
>

Create Config Backup

</button>


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


</Section>









<Section
icon="🎬"
title="Plex"
>


<Row
label="Server Label"
value={current.ServerLabel}
edit={editMode}
onChange={v=>updateField("ServerLabel",v)}
/>


<Row
label="Plex Web URL"
value={current.PlexWebUrl}
edit={editMode}
onChange={v=>updateField("PlexWebUrl",v)}
/>


<Row
label="Plex Server URL"
value={current.PlexServerUrl}
edit={editMode}
onChange={v=>updateField("PlexServerUrl",v)}
/>


<Row
label="PlexToken"
value={current.PlexToken}
sensitive
edit={editMode}
onChange={v=>updateField("PlexToken",v)}
/>


</Section>









<Section
icon="📊"
title="Tautulli"
>


<Row
label="Tautulli URL"
value={current.TautulliUrl}
edit={editMode}
onChange={v=>updateField("TautulliUrl",v)}
/>


<Row
label="API Key"
value={current.ApiKey}
sensitive
edit={editMode}
onChange={v=>updateField("ApiKey",v)}
/>


</Section>









<Section
icon="📧"
title="Email / SMTP"
>


{

[
"FromName",
"FromEmail",
"ReplyToEmail",
"SmtpHost",
"SmtpPort",
"SmtpUsername",
"SmtpPassword",
"TestEmail"

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


</Section>









<Section
icon="⏰"
title="Scheduler"
>


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

onChange={v=>updateField(key,v)}

/>

)

}


</Section>









<Section
icon="📰"
title="Newsletter Settings"
>


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

onChange={v=>updateField(key,v)}

/>

)

}


</Section>





</div>

);


}
