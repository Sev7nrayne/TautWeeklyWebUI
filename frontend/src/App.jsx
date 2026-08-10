import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Config from "./pages/Config";
import Logs from "./pages/Logs";

function App(){

    const [page,setPage] = useState("dashboard");

    return (

        <div
        style={{
            background:"#111",
            color:"#fff",
            minHeight:"100vh",
            padding:"30px",
            fontFamily:"Arial"
        }}
        >

            <nav
            style={{
                marginBottom:"20px"
            }}
            >

                <button
                style={{
                    marginRight:"10px",
                    padding:"10px"
                }}
                onClick={() => setPage("dashboard")}
                >
                    Dashboard
                </button>

                <button
                style={{
                    marginRight:"10px",
                    padding:"10px"
                }}
                onClick={() => setPage("config")}
                >
                    Configuration
                </button>

                <button
                style={{
                    marginRight:"10px",
                    padding:"10px"
                }}
                onClick={() => setPage("logs")}
                >
                    Logs
                </button>

            </nav>

            <hr />

            {
                page === "config"

                ?

                <Config />

                :

                page === "logs"

                ?

                <Logs />

                :

                <Dashboard />
            }

        </div>

    );

}

export default App;
