export default function StatusCard({
    title,
    icon,
    status,
    message
}) {

    let indicator = "⚪";

    if (status === "online") {
        indicator = "🟢";
    }

    if (status === "offline") {
        indicator = "🔴";
    }

    if (status === "warning") {
        indicator = "🟡";
    }


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


            <div
                style={{
                    fontSize:"18px",
                    marginTop:"10px"
                }}
            >

                {indicator} {status?.toUpperCase()}

            </div>


            <div
                style={{
                    marginTop:"8px",
                    opacity:0.8
                }}
            >

                {message}

            </div>


        </div>

    );

}
