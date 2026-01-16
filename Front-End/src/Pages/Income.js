import Navbar from "../Components/Navbar";
import { useEffect, useMemo, useState, useContext } from "react";
import { languageContext } from "../Contexts";
import style from "../Style/Income.module.css";
import { Add } from "../Services/Income/Add";

const views = {
  add: "add",
  change: "change",
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
  alltime: "alltime",
};

function Income() {
  const [view, setView] = useState(views.add);

  //add income variables
  const [addDate, setAddDate] = useState("");
  const [addCash, setAddCash] = useState("");
  const [addQris, setAddQris] = useState("");
  const [addFnb, setAddFnb] = useState("");

  //add income function
  const handleAdd = async () => {
    if (!addDate) return;
    const [y, m, d] = addDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;
    console.log(dateForBackend)
  };

  return (
    <div>
      <Navbar />
      {view === views.add && (
        <>
          <input
            onChange={(e) => {
              setAddDate(e.target.value);
            }}
            value={addDate}
            type="date"
          ></input>

          <button onClick={handleAdd}></button>
        </>
      )}
    </div>
  );
}

export default Income;
