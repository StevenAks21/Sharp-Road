import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Pages/Login";
import Welcome from "./Pages/Welcome";
import { insideContext, languageContext } from "./Contexts.js";



function App() {
  const [insideBuilding, setInsideBuilding] = useState(null);
  const [language, setLanguage] = useState(null);

  return (
    <languageContext.Provider value={[language, setLanguage]}>
      <insideContext.Provider value={[insideBuilding, setInsideBuilding]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<Welcome />} />
        </Routes>
      </insideContext.Provider>
    </languageContext.Provider>
  );
}

export default App;