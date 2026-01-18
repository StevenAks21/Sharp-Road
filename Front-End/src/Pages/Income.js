import Navbar from "../Components/Navbar";
import { useEffect, useState, useContext } from "react";
import { languageContext } from "../Contexts";
import style from "../Style/Income.module.css";
import { Add } from "../Services/Income/Add";
import { Change } from '../Services/Income/Change'

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
    addSuccessMessage: "Successfully added income",

    changeButton: 'Change Income',
    changeSuccessMessage: 'Successfully changed income'

  },
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
    addSuccessMessage: "Pemasukan berhasil terekam",

    changeButton: 'Ganti Pemasukan',
    changeSuccessMessage: 'Berhasil mengubah pendapatan'
  },
};

function ButtonViews({ text, setView }) {
  return (
    <>
      <button onClick={() => setView(views.add)}>{text.addIncome}</button>
      <button onClick={() => setView(views.change)}>{text.changeIncome}</button>
      <button onClick={() => setView(views.daily)}>{text.getDailyIncome}</button>
      <button onClick={() => setView(views.weekly)}>{text.getWeeklyIncome}</button>
      <button onClick={() => setView(views.monthly)}>{text.getMonthlyIncome}</button>
      <button onClick={() => setView(views.alltime)}>{text.getAllTimeIncome}</button>
    </>
  );
}

function AddIncomePage({
  text,
  addDate,
  setAddDate,
  addCash,
  setAddCash,
  addFnb,
  setAddFnb,
  addQris,
  setAddQris,
  addError,
  addErrorMessage,
  addFinished,
  addSuccessMessage,
  handleAdd,
}) {
  return (
    <>
      {addFinished && !addError && <p>{addSuccessMessage}</p>}
      {addError && <p>{addErrorMessage}</p>}

      <input
        type="date"
        value={addDate}
        onChange={(e) => setAddDate(e.target.value)}
      />

      <input
        value={addCash}
        onChange={(e) => setAddCash(e.target.value)}
        placeholder={text.cashAmount}
        inputMode="numeric"
      />

      <input
        value={addFnb}
        onChange={(e) => setAddFnb(e.target.value)}
        placeholder={text.fnbAmount}
        inputMode="numeric"
      />

      <input
        value={addQris}
        onChange={(e) => setAddQris(e.target.value)}
        placeholder={text.qrisAmount}
        inputMode="numeric"
      />

      <button onClick={handleAdd}>{text.addIncome}</button>
    </>
  );
}

function ChangeIncomePage({
  text,
  changeDate,
  setChangeDate,
  changeCash,
  setChangeCash,
  changeFnb,
  setChangeFnb,
  changeQris,
  setChangeQris,
  changeNote,
  setChangeNote,
  handleChange,
  changeError,
  changeErrorMessage,
  changeFinished,
  changeSuccessMessage,
}) {
  return (
    <>
      {changeFinished && !changeError && <p>{changeSuccessMessage}</p>}
      {changeError && <p>{changeErrorMessage}</p>}

      <input
        type="date"
        value={changeDate}
        onChange={(e) => setChangeDate(e.target.value)}
      />

      <input
        value={changeCash}
        onChange={(e) => setChangeCash(e.target.value)}
        placeholder={text.cashAmount}
        inputMode="numeric"
      />

      <input
        value={changeFnb}
        onChange={(e) => setChangeFnb(e.target.value)}
        placeholder={text.fnbAmount}
        inputMode="numeric"
      />

      <input
        value={changeQris}
        onChange={(e) => setChangeQris(e.target.value)}
        placeholder={text.qrisAmount}
        inputMode="numeric"
      />

      <input
        value={changeNote}
        onChange={(e) => setChangeNote(e.target.value)}
        placeholder="Note"
      />

      <button onClick={handleChange}>{text.changeButton}</button>
    </>
  );
}


function Income() {
  const [language] = useContext(languageContext);
  const [view, setView] = useState(views.add);
  const text = TEXT[language ?? "English"];

  useEffect(() => {
    document.title = text.documentTitle;
  }, [text.documentTitle]);

  // add income state
  const [addDate, setAddDate] = useState("");
  const [addCash, setAddCash] = useState("");
  const [addQris, setAddQris] = useState("");
  const [addFnb, setAddFnb] = useState("");
  const [addError, setAddError] = useState(false);
  const [addErrorMessage, setAddErrorMessage] = useState("");
  const [addSuccessMessage, setAddSuccessMessage] = useState("");
  const [addFinished, setAddFinished] = useState(false);

  // change income state
  const [changeDate, setChangeDate] = useState("");
  const [changeCash, setChangeCash] = useState("");
  const [changeQris, setChangeQris] = useState("");
  const [changeFnb, setChangeFnb] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [changeError, setChangeError] = useState(false);
  const [changeErrorMessage, setChangeErrorMessage] = useState("");
  const [changeSuccessMessage, setChangeSuccessMessage] = useState("");
  const [changeFinished, setChangeFinished] = useState(false);

  const handleAdd = async () => {
    setAddFinished(false);
    setAddError(false);
    setAddErrorMessage("");
    setAddSuccessMessage("");


    if (!addDate) return;

    const [y, m, d] = addDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    const cash = Number(addCash);
    const fnb = Number(addFnb);
    const qris = Number(addQris);

    if (Number.isNaN(cash) || Number.isNaN(fnb) || Number.isNaN(qris)) {
      setAddError(true);
      setAddErrorMessage("Please enter valid numbers.");
      setAddFinished(true);
      return;
    }

    const response = await Add(dateForBackend, cash, fnb, qris);

    if (response?.error) {
      setAddError(true);
      setAddErrorMessage(response.message ?? "Something went wrong.");
      setAddFinished(true);
      return;
    }

    setAddFinished(true);
    setAddSuccessMessage(text.addSuccessMessage);
  };

  const handleChange = async () => {

    setChangeFinished(false);
    setChangeError(false);
    setChangeErrorMessage("");
    setChangeSuccessMessage("");


    if (!changeDate) return;

    const [y, m, d] = changeDate.split('-')
    const dateForBackend = `${d}-${m}-${y}`

    const cash = Number(changeCash)
    const fnb = Number(changeFnb)
    const qris = Number(changeQris)

    if (Number.isNaN(cash) || Number.isNaN(fnb) || Number.isNaN(qris)) {
      setChangeError(true);
      setChangeErrorMessage("Please enter valid numbers.");
      setChangeFinished(true);
      return;
    }


    const response = await Change(dateForBackend, cash, fnb, qris, changeNote)

    if (response?.error) {
      setChangeError(true);
      setChangeErrorMessage(response.message ?? "Something went wrong.");
      setChangeFinished(true);
      return;
    }

    setChangeFinished(true);
    setChangeSuccessMessage(text.changeSuccessMessage);

  }

  return (
    <div className={style.container}>
      <Navbar />

      <ButtonViews text={text} setView={setView} />

      {view === views.add && (
        <AddIncomePage
          text={text}
          addDate={addDate}
          setAddDate={setAddDate}
          addCash={addCash}
          setAddCash={setAddCash}
          addFnb={addFnb}
          setAddFnb={setAddFnb}
          addQris={addQris}
          setAddQris={setAddQris}
          addError={addError}
          addErrorMessage={addErrorMessage}
          addFinished={addFinished}
          addSuccessMessage={addSuccessMessage}
          handleAdd={handleAdd}
        />
      )}

      {view === views.change && (
        <ChangeIncomePage
          text={text}
          changeDate={changeDate}
          setChangeDate={setChangeDate}
          changeCash={changeCash}
          setChangeCash={setChangeCash}
          changeFnb={changeFnb}
          setChangeFnb={setChangeFnb}
          changeQris={changeQris}
          setChangeQris={setChangeQris}
          changeNote={changeNote}
          setChangeNote={setChangeNote}
          changeError={changeError}
          changeErrorMessage={changeErrorMessage}
          changeFinished={changeFinished}
          changeSuccessMessage={changeSuccessMessage}
          handleChange={handleChange}
        />
      )}

    </div>
  );
}

export default Income;
