import { useContext, useState } from "react";
import { insideContext } from "../App";

function Welcome(){
    const [insideBuilding, setInsideBuilding] = useContext(insideContext)
    return(
        <div>
            <h1>Welcome to SharpRoad</h1>
            <h1>Please Pick a Language / Mohon Pilih Bahasa</h1>
        </div>
    )
}

export default Welcome;