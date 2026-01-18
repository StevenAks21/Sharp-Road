import Navbar from "../Components/Navbar";
import { useEffect, useState, useContext } from "react";
import { languageContext } from "../Contexts";
import style from "../Style/Income.module.css";
import { Add } from "../Services/Income/Add";
import { Change } from '../Services/Income/Change'
import { Daily } from '../Services/Income/Daily'
import { Weekly } from "../Services/Income/Weekly";
import { Monthly } from "../Services/Income/Monthly";


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
    changeSuccessMessage: 'Successfully changed income',
    dailyDate: "Date",
    getDailyButton: "Get Daily Income",
    dailySuccessMessage: "Daily income loaded",
    noDailyDateError: "Please select a date.",

    weeklySuccessMessage: "Weekly income loaded",
    noWeeklyDateError: "Please select a date.",
    monthlySuccessMessage: "Monthly income loaded",
    noMonthlyDateError: "Please select a date.",


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
    changeSuccessMessage: 'Berhasil mengubah pendapatan',
    dailyDate: "Tanggal",
    getDailyButton: "Lihat Pemasukan Harian",
    dailySuccessMessage: "Pemasukan harian berhasil dimuat",
    noDailyDateError: "Pilih tanggal dulu.",

    weeklySuccessMessage: "Pemasukan mingguan berhasil dimuat",
    noWeeklyDateError: "Pilih tanggal dulu.",
    monthlySuccessMessage: "Pemasukan bulanan berhasil dimuat",
    noMonthlyDateError: "Pilih tanggal dulu.",

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

function DailyIncomePage({
  text,
  dailyDate,
  setDailyDate,
  handleDaily,
  dailyError,
  dailyErrorMessage,
  dailyFinished,
  dailySuccessMessage,
  dailyData,
}) {
  return (
    <>
      {dailyFinished && !dailyError && <p>{dailySuccessMessage}</p>}
      {dailyError && <p>{dailyErrorMessage}</p>}

      <input
        type="date"
        value={dailyDate}
        onChange={(e) => setDailyDate(e.target.value)}
      />

      <button onClick={handleDaily}>{text.getDailyIncome}</button>

      {dailyData && (
        <div>
          <p>Cash: {dailyData.result.cash ?? 0}</p>
          <p>FNB: {dailyData.result.fnb ?? 0}</p>
          <p>QRIS: {dailyData.result.qris ?? 0}</p>
        </div>
      )}
    </>
  );
}

function WeeklyIncomePage({
  text,
  weeklyDate,
  setWeeklyDate,
  handleWeekly,
  weeklyError,
  weeklyErrorMessage,
  weeklyFinished,
  weeklySuccessMessage,
  weeklyData,
}) {
  // Backend: result = [totalIncome, totalFNB, totalCash, totalQris, totalRental, dailyReport]
  const totalIncome = weeklyData?.result?.[0]?.total_income ?? 0;
  const totalFnb = weeklyData?.result?.[1]?.fnb_total ?? 0;
  const totalCash = weeklyData?.result?.[2]?.cash_total ?? 0;
  const totalQris = weeklyData?.result?.[3]?.qris_total ?? 0;
  const totalRental = weeklyData?.result?.[4]?.totalRental ?? 0;

  return (
    <>
      {weeklyFinished && !weeklyError && <p>{weeklySuccessMessage}</p>}
      {weeklyError && <p>{weeklyErrorMessage}</p>}

      <input
        type="date"
        value={weeklyDate}
        onChange={(e) => setWeeklyDate(e.target.value)}
      />

      <button onClick={handleWeekly}>{text.getWeeklyIncome}</button>

      {weeklyData && !weeklyError && (
        <div>
          <p>Start: {weeklyData.start}</p>
          <p>End: {weeklyData.end}</p>

          <p>Total Income: {totalIncome}</p>
          <p>Cash Total: {totalCash}</p>
          <p>QRIS Total: {totalQris}</p>
          <p>FNB Total: {totalFnb}</p>
          <p>Total Rental: {totalRental}</p>
        </div>
      )}
    </>
  );
}


function MonthlyIncomePage({
  text,
  monthlyDate,
  setMonthlyDate,
  handleMonthly,
  monthlyError,
  monthlyErrorMessage,
  monthlyFinished,
  monthlySuccessMessage,
  monthlyData,
}) {
  const totalIncome = monthlyData?.result?.[0]?.total_income ?? 0;
  const totalFnb = monthlyData?.result?.[1]?.fnb_total ?? 0;
  const totalCash = monthlyData?.result?.[2]?.cash_total ?? 0;
  const totalQris = monthlyData?.result?.[3]?.qris_total ?? 0;
  const totalRental = monthlyData?.result?.[4]?.totalRental ?? 0;

  return (
    <>
      {monthlyFinished && !monthlyError && <p>{monthlySuccessMessage}</p>}
      {monthlyError && <p>{monthlyErrorMessage}</p>}

      <input
        type="date"
        value={monthlyDate}
        onChange={(e) => setMonthlyDate(e.target.value)}
      />

      <button onClick={handleMonthly}>{text.getMonthlyIncome}</button>

      {monthlyData && !monthlyError && (
        <div>
          <p>Start: {monthlyData.start}</p>
          <p>End: {monthlyData.end}</p>

          <p>Total Income: {totalIncome}</p>
          <p>Cash Total: {totalCash}</p>
          <p>QRIS Total: {totalQris}</p>
          <p>FNB Total: {totalFnb}</p>
          <p>Total Rental: {totalRental}</p>
        </div>
      )}
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

  // daily income state
  const [dailyDate, setDailyDate] = useState("");
  const [dailyError, setDailyError] = useState(false);
  const [dailyErrorMessage, setDailyErrorMessage] = useState("");
  const [dailySuccessMessage, setDailySuccessMessage] = useState("");
  const [dailyFinished, setDailyFinished] = useState(false);
  const [dailyData, setDailyData] = useState(null);

  // weekly state
  const [weeklyDate, setWeeklyDate] = useState("");
  const [weeklyError, setWeeklyError] = useState(false);
  const [weeklyErrorMessage, setWeeklyErrorMessage] = useState("");
  const [weeklySuccessMessage, setWeeklySuccessMessage] = useState("");
  const [weeklyFinished, setWeeklyFinished] = useState(false);
  const [weeklyData, setWeeklyData] = useState(null);

  // monthly state
  const [monthlyDate, setMonthlyDate] = useState("");
  const [monthlyError, setMonthlyError] = useState(false);
  const [monthlyErrorMessage, setMonthlyErrorMessage] = useState("");
  const [monthlySuccessMessage, setMonthlySuccessMessage] = useState("");
  const [monthlyFinished, setMonthlyFinished] = useState(false);
  const [monthlyData, setMonthlyData] = useState(null);



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

  const handleDaily = async () => {
    setDailyFinished(false);
    setDailyError(false);
    setDailyErrorMessage("");
    setDailySuccessMessage("");
    setDailyData(null);

    if (!dailyDate) {
      setDailyError(true);
      setDailyErrorMessage("Please select a date.");
      setDailyFinished(true);
      return;
    }

    const [y, m, d] = dailyDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    const response = await Daily(dateForBackend);

    if (response?.error) {
      setDailyError(true);
      setDailyErrorMessage(response.message ?? "Something went wrong.");
      setDailyFinished(true);
      return;
    }

    setDailyData(response);
    setDailyFinished(true);
    setDailySuccessMessage("Loaded daily income.");
  };

  const handleWeekly = async () => {
    setWeeklyFinished(false);
    setWeeklyError(false);
    setWeeklyErrorMessage("");
    setWeeklySuccessMessage("");
    setWeeklyData(null);

    if (!weeklyDate) {
      setWeeklyError(true);
      setWeeklyErrorMessage(text.noWeeklyDateError);
      setWeeklyFinished(true);
      return;
    }

    const [y, m, d] = weeklyDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    const response = await Weekly(dateForBackend);

    if (response?.error) {
      setWeeklyError(true);
      setWeeklyErrorMessage(response.message ?? "Something went wrong.");
      setWeeklyFinished(true);
      return;
    }

    setWeeklyData(response);
    setWeeklyFinished(true);
    setWeeklySuccessMessage(text.weeklySuccessMessage);
  };

  const handleMonthly = async () => {
    setMonthlyFinished(false);
    setMonthlyError(false);
    setMonthlyErrorMessage("");
    setMonthlySuccessMessage("");
    setMonthlyData(null);

    if (!monthlyDate) {
      setMonthlyError(true);
      setMonthlyErrorMessage(text.noMonthlyDateError);
      setMonthlyFinished(true);
      return;
    }

    const [y, m, d] = monthlyDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    const response = await Monthly(dateForBackend);

    if (response?.error) {
      setMonthlyError(true);
      setMonthlyErrorMessage(response.message ?? "Something went wrong.");
      setMonthlyFinished(true);
      return;
    }

    setMonthlyData(response);
    setMonthlyFinished(true);
    setMonthlySuccessMessage(text.monthlySuccessMessage);
  };



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

      {view === views.daily && (
        <DailyIncomePage
          text={text}
          dailyDate={dailyDate}
          setDailyDate={setDailyDate}
          handleDaily={handleDaily}
          dailyError={dailyError}
          dailyErrorMessage={dailyErrorMessage}
          dailyFinished={dailyFinished}
          dailySuccessMessage={dailySuccessMessage}
          dailyData={dailyData}
        />
      )}

      {view === views.weekly && (
        <WeeklyIncomePage
          text={text}
          weeklyDate={weeklyDate}
          setWeeklyDate={setWeeklyDate}
          handleWeekly={handleWeekly}
          weeklyError={weeklyError}
          weeklyErrorMessage={weeklyErrorMessage}
          weeklyFinished={weeklyFinished}
          weeklySuccessMessage={weeklySuccessMessage}
          weeklyData={weeklyData}
        />
      )}

      {view === views.monthly && (
        <MonthlyIncomePage
          text={text}
          monthlyDate={monthlyDate}
          setMonthlyDate={setMonthlyDate}
          handleMonthly={handleMonthly}
          monthlyError={monthlyError}
          monthlyErrorMessage={monthlyErrorMessage}
          monthlyFinished={monthlyFinished}
          monthlySuccessMessage={monthlySuccessMessage}
          monthlyData={monthlyData}
        />
      )}



    </div>
  );
}

export default Income;
