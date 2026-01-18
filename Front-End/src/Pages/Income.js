import Navbar from "../Components/Navbar";
import { useEffect, useState, useContext } from "react";
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
    documentTitle: "Income Management",
    addIncome: "Add Income",
    changeIncome: "Change Income",
    getDailyIncome: "Get Daily Income",
    getWeeklyIncome: "Get Weekly Income",
    getMonthlyIncome: "Get Monthly Income",
    getAllTimeIncome: "Get All Time Income",
    cashAmount: "Cash Amount",
    fnbAmount: "FNB Amount",
    qrisAmount: "QRIS Amount",
  }
  ,
  Indonesian: {
    documentTitle: "Manajemen Pemasukan",
    addIncome: "Tambah Pemasukan",
    changeIncome: "Ubah Pemasukan",
    getDailyIncome: "Lihat Pemasukan Harian",
    getWeeklyIncome: "Lihat Pemasukan Mingguan",
    getMonthlyIncome: "Lihat Pemasukan Bulanan",
    getAllTimeIncome: "Lihat Pemasukan Sepanjang Waktu",
    cashAmount: "Jumlah Tunai",
    fnbAmount: "Jumlah FNB",
    qrisAmount: "Jumlah QRIS",
  }
}

function Income() {

  useEffect(() => {
    document.title = text.documentTitle;
  })

  const [language] = useContext(languageContext);
  const [view, setView] = useState(views.add);

  //add income variables
  const [addDate, setAddDate] = useState("");
  const [addCash, setAddCash] = useState("");
  const [addQris, setAddQris] = useState("");
  const [addFnb, setAddFnb] = useState("");
  const [addError, setAddError] = useState(false)
  const [addErrorMessage, setAddErrorMessage] = useState('')

  //add income function
  const handleAdd = async () => {
    if (!addDate) return;

    const [y, m, d] = addDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;
    console.log(dateForBackend, addCash, addFnb, addQris);
    const response = await Add(dateForBackend, parseInt(addCash, 10), parseInt(addFnb, 10), parseInt(addQris, 10));
    console.log(response)

    if (response.error) {
      setAddError(true)
      setAddErrorMessage(response.message)
    }

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
          {addError === true && (
            <p>
              {addErrorMessage}
            </p>
          )}
          <input
            onChange={(e) => {
              setAddDate(e.target.value);
            }}
            value={addDate}
            type="date"
          ></input>

          <input onChange={(e) => { setAddCash(e.target.value) }} value={addCash} placeholder={text.cashAmount}>

          </input>

          <input onChange={(e) => { setAddFnb(e.target.value) }} value={addFnb} placeholder={text.fnbAmount}>

          </input>

          <input onChange={(e) => { setAddQris(e.target.value) }} value={addQris} placeholder={text.qrisAmount}>

          </input>

          <button onClick={handleAdd}>{text.addIncome}</button>
        </>
      )}

      {view === views.change && (
        <>

        </>
      )}
    </div>
  );
}

export default Income;
