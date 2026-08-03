import {useEffect,useState} from "react";
import API from "../services/api";
import StatusCard from "../components/StatusCard";


export default function Dashboard(){


const [status,setStatus]=useState(null);

const [plexweekly,setPlexweekly]=useState(null);



useEffect(()=>{


API.getPlexWeeklyStatus()
.then(setPlexweekly);



fetch("/api/status")
.then(r=>r.json())
.then(setStatus);



},[]);



return (

<div>


<h1>
PlexWeekly-Manager
</h1>


<StatusCard
title="PlexWeekly"
icon="📨"
>


{

plexweekly ?

<>

<p>
{
plexweekly.installed
?
"🟢 Installed"
:
"🔴 Not Found"
}
</p>


<p>
{
plexweekly.config_exists
?
"🟢 Config Found"
:
"🔴 Missing Config"
}
</p>


<p>
{
plexweekly.logs_exists
?
"🟢 Logs Available"
:
"🔴 No Logs"
}
</p>

</>

:

<p>
Checking...
</p>

}


</StatusCard>



<StatusCard
title="Manager API"
icon="⚙️"
>


{

status ?

<>

<p>
🟢 Online
</p>


<p>
Version:
{" "}
{status.version}
</p>


</>

:

<p>
Checking...
</p>

}



</StatusCard>


</div>

)

}
