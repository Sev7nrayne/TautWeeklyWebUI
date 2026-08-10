const API = {


async getPlexWeeklyConfig(){
    const r = await fetch("/api/plexweekly/config");
    return await r.json();
},


async savePlexWeeklyConfig(config){

    const r = await fetch(
        "/api/plexweekly/config/save",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(config)
        }
    );

    return await r.json();
},


async getBackups(){

    const r = await fetch(
        "/api/plexweekly/backups"
    );

    return await r.json();
},


async createBackup(){

    const r = await fetch(
        "/api/plexweekly/backup",
        {
            method:"POST"
        }
    );

    return await r.json();

}


};


export async function deleteBackup(filename){

    const r = await fetch(
        "/api/plexweekly/backups/" +
        encodeURIComponent(filename),
        {
            method:"DELETE"
        }
    );

    return await r.json();

}


export default API;


export async function getServiceHealth(){

    const r = await fetch(
        "/api/health/services"
    );

    return await r.json();

}

