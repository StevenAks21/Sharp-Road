import { useContext } from "react";
import { languageContext, insideContext } from "../Contexts";
import { Navigate } from "react-router-dom";

function RequireSetup({ children }) {
    const [language] = useContext(languageContext);
    const [insideBuilding] = useContext(insideContext);

    if (!language || insideBuilding === null) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RequireSetup;