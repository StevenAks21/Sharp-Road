import { Routes, Route } from "react-router-dom";
import { useState, createContext } from "react";
import Login from "./Pages/Login";
import Welcome from "./Pages/Welcome";


export const insideContext = createContext();

function App() {
  const [insideBuilding, setInsideBuilding] = useState(null);
  return (

    <insideContext.Provider value={[insideBuilding, setInsideBuilding]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<Welcome />} />
      </Routes>
    </insideContext.Provider>
  );
}

export default App;