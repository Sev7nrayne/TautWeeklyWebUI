import {useEffect,useState} from "react";
import API from "../services/api";


export default function Scheduler(){


const [data,setData]=useState(null);



useEffect(()=>{

API.getTautWeeklyScheduler()
.then(setData);

},[]);



if(!data){

return <h2>Loading scheduler...</h2>;

}



return (

<div>

<h1>
📅 Scheduler
</h1>


<div
style={{
background:"#1b1b1b",
padding:"20px",
borderRadius:"12px"
}}
>


<p>

Heartbeat:

{" "}

{
data.heartbeat_exists

?

"🟢 Found"

:

"🔴 Missing"

}

</p>



<h3>
Heartbeat Data
</h3>


<pre>
{
JSON.stringify(
data.heartbeat,
null,
2
)
}
</pre>



<h3>
State
</h3>


<pre>
{
JSON.stringify(
data.state,
null,
2
)
}
</pre>



</div>


</div>

)

}
