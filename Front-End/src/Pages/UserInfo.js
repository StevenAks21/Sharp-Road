
import Navbar from "../Components/Navbar";
import { useEffect, useContext } from "react";
import { languageContext } from "../Contexts";

const TEXT = {
    English: {
        documentTitle: 'SharpRoad - User Info page'
    }
    ,
    Indonesian: {
        documentTitle: 'SharpRoad - Halaman Info Pengguna'
    }
}


function UserInfo() {
    const [language] = useContext(languageContext)

    useEffect(() => {

    })

    return (

        <div>
            <Navbar />
            <p>Hey from userinfo</p>
        </div>
    )
}

export default UserInfo;