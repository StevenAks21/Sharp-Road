import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Pages/Login";
import Welcome from "./Pages/Welcome";
import Home from "./Pages/Home";
import Employees from "./Pages/Employees";
import RequireSetup from "./Guard/RequireSetup.js";
import { insideContext, languageContext } from "./Contexts";

function App() {
  const [insideBuilding, setInsideBuilding] = useState(null);
  const [language, setLanguage] = useState(null);

  return (
    <languageContext.Provider value={[language, setLanguage]}>
      <insideContext.Provider value={[insideBuilding, setInsideBuilding]}>
        <Routes>

          <Route path="/" element={<Welcome />} />

          <Route
            path="/login"
            element={
              <RequireSetup>
                <Login />
              </RequireSetup>
            }
          />

          <Route
            path="/home"
            element={
              <RequireSetup>
                <Home />
              </RequireSetup>
            }
          />

          <Route
            path='/employees'
            element={
              <RequireSetup>
                <Employees />
              </RequireSetup>
            }
          />

        </Routes>
      </insideContext.Provider>
    </languageContext.Provider>
  );
}

export default App;