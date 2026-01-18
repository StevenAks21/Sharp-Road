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

const TEXT = {
  English: {
    addIncome: "Add Income",
    changeIncome: "Change Income",
    getDailyIncome: "Get Daily Income",
    getWeeklyIncome: "Get Weekly Income",
    getMonthlyIncome: "Get Monthly Income",
    getAllTimeIncome: "Get All Time Income",
  }
  ,
  Indonesian: {
    addIncome: "Tambah Pemasukan",
    changeIncome: "Ubah Pemasukan",
    getDailyIncome: "Lihat Pemasukan Harian",
    getWeeklyIncome: "Lihat Pemasukan Mingguan",
    getMonthlyIncome: "Lihat Pemasukan Bulanan",
    getAllTimeIncome: "Lihat Pemasukan Sepanjang Waktu",
  }
}

function Income() {
  const [language, setLanguage] = useContext(languageContext);
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

  const text = TEXT[language ?? "English"];

  return (
    <div>
      <Navbar />
      <button onClick={() => setView(views.add)}>
        {text.addIncome}
      </button>

      <button onClick={() => setView(views.change)}>
        {text.changeIncome}
      </button>

      <button onClick={() => setView(views.daily)}>
        {text.getDailyIncome}
      </button>

      <button onClick={() => setView(views.weekly)}>
        {text.getWeeklyIncome}
      </button>

      <button onClick={() => setView(views.monthly)}>
        {text.getMonthlyIncome}
      </button>

      <button onClick={() => setView(views.alltime)}>
        {text.getAllTimeIncome}
      </button>

      {view === views.add && (
        <>
          <input
            onChange={(e) => {
              setAddDate(e.target.value);
            }}
            value={addDate}
            type="date"
          ></input>

          <button onClick={handleAdd}>{text.addIncome}</button>
        </>
      )}

      {view === views.change && <div>change income</div>}
    </div>
  );
}

export default Income;
