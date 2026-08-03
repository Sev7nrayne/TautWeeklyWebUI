export default function StatusCard({
    title,
    icon,
    children
}) {


return (

<div
style={{
background:"#1b1b1b",
padding:"20px",
borderRadius:"12px",
margin:"15px 0"
}}
>

<h2>

{icon} {title}

</h2>


<div>

{children}

</div>


</div>

);


}
