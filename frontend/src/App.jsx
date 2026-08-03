import {useEffect,useState} from "react"


function App(){

const [status,setStatus]=useState(null)


useEffect(()=>{

fetch("/api/status")
.then(res=>res.json())
.then(data=>setStatus(data))
.catch(()=>{
setStatus({
error:"Backend unavailable"
})
})

},[])


return (

<div style={{
background:"#111",
color:"#fff",
minHeight:"100vh",
padding:"30px",
fontFamily:"Arial"
}}>


<h1>
PlexWeekly-Manager
</h1>


<h3>
Dashboard
</h3>


<div style={{
background:"#222",
padding:"20px",
borderRadius:"10px",
width:"350px"
}}>

<h2>
Backend Status
</h2>


{
status ?

<pre>
{JSON.stringify(status,null,2)}
</pre>

:

<p>
Checking...
</p>

}


</div>


</div>

)

}


export default App
