import Navbar from "../Components/Navbar";
import { useEffect, useMemo, useState, useContext } from "react";
import { languageContext } from "../Contexts";
import style from "../Style/Income.module.css";

function Income() {
  return (
    <div>
      <Navbar />
      <p>Hi</p>
    </div>
  );
}

export default Income;
