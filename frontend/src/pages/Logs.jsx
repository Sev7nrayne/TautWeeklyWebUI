import {useEffect,useState} from "react";
import API from "../services/api";


export default function Logs(){


const [logs,setLogs]=useState(null);



useEffect(()=>{


API.getPlexWeeklyLogs()
.then(setLogs);



},[]);



if(!logs){

return (
<h2>
Loading logs...
</h2>
)

}



return (

<div>


<h1>
📜 PlexWeekly Logs
</h1>


<p>
Entries:
{" "}
{logs.count}
</p>



<div
style={{

background:"#000",
padding:"20px",
borderRadius:"10px",
fontFamily:"monospace",
whiteSpace:"pre-wrap"

}}
>


{

logs.logs.map(
(item,index)=>(


<div
key={index}
>


[{item.file}]

{" "}

{item.line}


</div>


)

)


}


</div>


</div>

)

}
