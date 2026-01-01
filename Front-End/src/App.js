import { Routes, Route } from "react-router-dom";
import { useState, createContext } from "react";
import Login from "./Pages/Login";
import Welcome from "./Pages/Welcome";


export const insideContext = createContext();
export const languageContext = createContext();

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