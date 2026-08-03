import { useEffect, useState } from "react";
import API from "../services/api";


const SENSITIVE_FIELDS = [
    "ApiKey",
    "PlexToken",
    "SmtpPassword"
];


function displayValue(key, value){

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
    onChange
}){


    return (

        <div

            style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                padding:"8px 0",
                borderBottom:"1px solid #333",
                gap:"20px"
            }}

        >

            <span>
                {label}
            </span>



            {
                edit

                ?

                <input

                    value={value ?? ""}

                    onChange={
                        e =>
                            onChange(
                                e.target.value
                            )
                    }

                    style={{
                        flex:"1",
                        maxWidth:"500px"
                    }}

                />

                :

                <span>
                    {value}
                </span>

            }


        </div>

    );

}






export default function Config(){


    const [config,setConfig] =
        useState(null);


    const [editMode,setEditMode] =
        useState(false);


    const [editConfig,setEditConfig] =
        useState(null);


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







    function updateField(
        key,
        value
    ){

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
                "Backup created successfully"
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








    if(!config){

        return (
            <h2>
                Loading configuration...
            </h2>
        );

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

                    onClick={()=>{

                        setMessage(
                            "Save disabled until backend validation is added"
                        );

                    }}

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

                        file =>

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
                    value={
                        editMode
                        ?
                        editConfig.ServerLabel
                        :
                        config.ServerLabel
                    }

                    edit={editMode}

                    onChange={
                        v =>
                        updateField(
                            "ServerLabel",
                            v
                        )
                    }

                />



                <Row
                    label="Plex Web URL"
                    value={
                        editMode
                        ?
                        editConfig.PlexWebUrl
                        :
                        config.PlexWebUrl
                    }

                    edit={editMode}

                    onChange={
                        v =>
                        updateField(
                            "PlexWebUrl",
                            v
                        )
                    }

                />




                <Row
                    label="Plex Server URL"
                    value={
                        editMode
                        ?
                        editConfig.PlexServerUrl
                        :
                        config.PlexServerUrl
                    }

                    edit={editMode}

                    onChange={
                        v =>
                        updateField(
                            "PlexServerUrl",
                            v
                        )
                    }

                />




                <Row
                    label="Plex Token"
                    value={
                        editMode
                        ?
                        editConfig.PlexToken
                        :
                        displayValue(
                            "PlexToken",
                            config.PlexToken
                        )
                    }

                    edit={editMode}

                    onChange={
                        v =>
                        updateField(
                            "PlexToken",
                            v
                        )
                    }

                />



            </Section>








            <Section
                icon="📊"
                title="Tautulli"
            >

                <Row
                    label="Tautulli URL"
                    value={
                        editMode
                        ?
                        editConfig.TautulliUrl
                        :
                        config.TautulliUrl
                    }

                    edit={editMode}

                    onChange={
                        v =>
                        updateField(
                            "TautulliUrl",
                            v
                        )
                    }

                />



                <Row
                    label="API Key"
                    value={
                        editMode
                        ?
                        editConfig.ApiKey
                        :
                        displayValue(
                            "ApiKey",
                            config.ApiKey
                        )
                    }

                    edit={editMode}

                    onChange={
                        v =>
                        updateField(
                            "ApiKey",
                            v
                        )
                    }

                />

            </Section>








            <Section
                icon="📧"
                title="Email / SMTP"
            >

                <Row
                    label="SMTP Host"
                    value={
                        editMode
                        ?
                        editConfig.SmtpHost
                        :
                        config.SmtpHost
                    }

                    edit={editMode}

                    onChange={
                        v =>
                        updateField(
                            "SmtpHost",
                            v
                        )
                    }

                />


                <Row
                    label="SMTP Username"
                    value={
                        editMode
                        ?
                        editConfig.SmtpUsername
                        :
                        config.SmtpUsername
                    }

                    edit={editMode}

                    onChange={
                        v =>
                        updateField(
                            "SmtpUsername",
                            v
                        )
                    }

                />


            </Section>





        </div>

    );

}
