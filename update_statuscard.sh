#!/bin/bash
set -e

FILE="frontend/src/components/StatusCard.jsx"

cp "$FILE" "$FILE.backup"

cat > "$FILE" <<'JSX'
export default function StatusCard({
    title,
    icon,
    status,
    message
}) {

    function statusColor(value) {

        if (value === "online") {
            return "#22c55e";
        }

        if (value === "warning") {
            return "#eab308";
        }

        if (value === "offline") {
            return "#ef4444";
        }

        return "#6b7280";
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
                    display:"flex",
                    alignItems:"center",
                    gap:"10px"
                }}
            >

                <span
                    style={{
                        width:"14px",
                        height:"14px",
                        borderRadius:"50%",
                        background:statusColor(status),
                        display:"inline-block"
                    }}
                ></span>


                <strong>
                    {status ? status.toUpperCase() : "UNKNOWN"}
                </strong>

            </div>


            <div
                style={{
                    marginTop:"8px",
                    color:"#aaa"
                }}
            >
                {message}
            </div>


        </div>

    );

}
JSX

echo "StatusCard updated"

