import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Pages/Login";
import Welcome from "./Pages/Welcome";
import Home from "./Pages/Home";
import Employees from "./Pages/Employees";
import Income from "./Pages/Income.js";
import UserInfo from "./Pages/UserInfo.js";
import Inventory from "./Pages/Inventory.js";
import Booking from './Pages/Booking.js'
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
            path="/employees"
            element={
              <RequireSetup>
                <Employees />
              </RequireSetup>
            }
          />

          <Route
            path="/income"
            element={
              <RequireSetup>
                <Income />
              </RequireSetup>
            }
          />

          <Route
            path='/userinfo'
            element={
              <RequireSetup>
                <UserInfo />
              </RequireSetup>
            }
          />
          <Route
            path='/inventory'
            element={
              <RequireSetup>
                <Inventory />
              </RequireSetup>
            }
          />

          <Route
            path='/booking'
            element={
              <RequireSetup>
                <Booking />
              </RequireSetup>
            }
          />
        </Routes>
      </insideContext.Provider>
    </languageContext.Provider>
  );
}

export default App;
