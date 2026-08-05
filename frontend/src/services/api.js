const API = {


    async getPlexWeeklyConfig(){

        const response = await fetch(
            "/api/plexweekly/config"
        );

        return await response.json();

    },


    async getPlexWeeklyStatus(){

        const response = await fetch(
            "/api/plexweekly/status"
        );

        return await response.json();

    },


    async getPlexWeeklySchema(){

        const response = await fetch(
            "/api/plexweekly/schema"
        );

        return await response.json();

    },


    async getPlexWeeklyLogs(){

        const response = await fetch(
            "/api/plexweekly/logs"
        );

        return await response.json();

    },


    async getPlexWeeklyScheduler(){

        const response = await fetch(
            "/api/plexweekly/scheduler"
        );

        return await response.json();

    },


    async createBackup(){

        const response = await fetch(
            "/api/plexweekly/backup",
            {
                method:"POST"
            }
        );

        return await response.json();

    },


    async getBackups(){

        const response = await fetch(
            "/api/plexweekly/backups"
        );

        return await response.json();

    },


    async savePlexWeeklyConfig(config){

        const response = await fetch(
            "/api/plexweekly/config/save",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(config)

            }
        );


        return await response.json();

    }


};


export default API;


export async function getServiceHealth() {
    const res = await fetch("/api/health/services");
    return await res.json();
}
