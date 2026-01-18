// Income.jsx
import Navbar from "../Components/Navbar";
import { useEffect, useMemo, useState, useContext } from "react";
import { languageContext } from "../Contexts";
import style from "../Style/Income.module.css";
import { Add } from "../Services/Income/Add";
import { Change } from "../Services/Income/Change";
import { Daily } from "../Services/Income/Daily";
import { Weekly } from "../Services/Income/Weekly";
import { Monthly } from "../Services/Income/Monthly";
import { Alltime } from "../Services/Income/Alltime";

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
    title: "Income Management",
    subtitle: "Track, update, and review income in a clean black and white dashboard.",

    addIncome: "Add Income",
    changeIncome: "Change Income",
    getDailyIncome: "Get Daily Income",
    getWeeklyIncome: "Get Weekly Income",
    getMonthlyIncome: "Get Monthly Income",
    getAllTimeIncome: "Get All Time Income",

    cashAmount: "Cash Amount",
    fnbAmount: "FNB Amount",
    qrisAmount: "QRIS Amount",
    notes: "Notes",
    addSuccessMessage: "Successfully added income",

    changeButton: "Change Income",
    changeSuccessMessage: "Successfully changed income",

    dailyDate: "Date",
    getDailyButton: "Get Daily Income",
    dailySuccessMessage: "Daily income loaded",
    noDailyDateError: "Please select a date.",

    weeklySuccessMessage: "Weekly income loaded",
    noWeeklyDateError: "Please select a date.",

    monthlySuccessMessage: "Monthly income loaded",
    noMonthlyDateError: "Please select a date.",

    alltimeSuccessMessage: "All-time income loaded",
    getAlltimeButton: "Get All Time Income",

    helper: "Pick a view above to get started.",
    totals: "Totals",
    start: "Start",
    end: "End",
    totalIncome: "Total Income",
    totalRental: "Total Rental",
    records: "Records",
  },
  Indonesian: {
    documentTitle: "Manajemen Pemasukan",
    title: "Manajemen Pemasukan",
    subtitle: "Catat, ubah, dan lihat pemasukan dengan dashboard hitam putih yang rapi.",

    addIncome: "Tambah Pemasukan",
    changeIncome: "Ubah Pemasukan",
    getDailyIncome: "Lihat Pemasukan Harian",
    getWeeklyIncome: "Lihat Pemasukan Mingguan",
    getMonthlyIncome: "Lihat Pemasukan Bulanan",
    getAllTimeIncome: "Lihat Pemasukan Sepanjang Waktu",

    cashAmount: "Jumlah Tunai",
    fnbAmount: "Jumlah FNB",
    qrisAmount: "Jumlah QRIS",
    notes: "Catatan",
    addSuccessMessage: "Pemasukan berhasil terekam",

    changeButton: "Ganti Pemasukan",
    changeSuccessMessage: "Berhasil mengubah pendapatan",

    dailyDate: "Tanggal",
    getDailyButton: "Lihat Pemasukan Harian",
    dailySuccessMessage: "Pemasukan harian berhasil dimuat",
    noDailyDateError: "Pilih tanggal dulu.",

    weeklySuccessMessage: "Pemasukan mingguan berhasil dimuat",
    noWeeklyDateError: "Pilih tanggal dulu.",

    monthlySuccessMessage: "Pemasukan bulanan berhasil dimuat",
    noMonthlyDateError: "Pilih tanggal dulu.",

    alltimeSuccessMessage: "Pemasukan sepanjang waktu berhasil dimuat",
    getAlltimeButton: "Lihat Pemasukan Sepanjang Waktu",

    helper: "Pilih menu di atas untuk mulai.",
    totals: "Ringkasan",
    start: "Mulai",
    end: "Sampai",
    totalIncome: "Total Pemasukan",
    totalRental: "Total Rental",
    records: "Data",
  },
};

function ButtonViews({ text, view, setView }) {
  const buttons = [
    { key: views.add, label: text.addIncome },
    { key: views.change, label: text.changeIncome },
    { key: views.daily, label: text.getDailyIncome },
    { key: views.weekly, label: text.getWeeklyIncome },
    { key: views.monthly, label: text.getMonthlyIncome },
    { key: views.alltime, label: text.getAllTimeIncome },
  ];

  return (
    <div className={style.buttonRow}>
      {buttons.map((b) => (
        <button
          key={b.key}
          className={`${style.button} ${view === b.key ? style.activeButton : ""}`}
          onClick={() => setView(b.key)}
          type="button"
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

function MessageBanner({ error, success }) {
  if (error) return <p className={style.error}>{error}</p>;
  if (success) return <p className={style.success}>{success}</p>;
  return null;
}

function Card({ title, children }) {
  return (
    <div className={`${style.card} ${style.fadeInUp}`}>
      <h3 className={style.cardTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className={style.field}>
      <div className={style.label}>{label}</div>
      {children}
    </div>
  );
}

function MetricCard({ title, items, pillLabel }) {
  return (
    <div className={`${style.employeeCard} ${style.fadeInUp}`}>
      <div className={style.employeeHeader}>
        <div className={style.employeeIdentity}>
          <div className={style.employeeName}>{title}</div>
          {pillLabel ? <div className={style.employeeMeta}>{pillLabel}</div> : null}
        </div>
        <div className={style.employeePill}>
          <span className={style.pillLabel}>•</span>
          <span className={style.mono}>B/W</span>
        </div>
      </div>

      <div className={style.employeeDivider} />

      <div className={style.employeeRows}>
        {items.map((row) => (
          <div className={style.employeeRow} key={row.key}>
            <div className={style.employeeKey}>{row.key}</div>
            <div className={`${style.employeeVal} ${style.mono}`}>{row.value}</div>
          </div>
        ))}
      </div>
    </div>
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
  const success = addFinished && !addError ? addSuccessMessage : "";
  const error = addError ? addErrorMessage : "";

  return (
    <div className={style.content}>
      <MessageBanner error={error} success={success} />

      <Card title={text.addIncome}>
        <Field label={text.dailyDate}>
          <input
            className={style.input}
            type="date"
            value={addDate}
            onChange={(e) => setAddDate(e.target.value)}
          />
        </Field>

        <div className={style.grid}>
          <Field label={text.cashAmount}>
            <input
              className={style.input}
              value={addCash}
              onChange={(e) => setAddCash(e.target.value)}
              placeholder={text.cashAmount}
              inputMode="numeric"
            />
          </Field>

          <Field label={text.fnbAmount}>
            <input
              className={style.input}
              value={addFnb}
              onChange={(e) => setAddFnb(e.target.value)}
              placeholder={text.fnbAmount}
              inputMode="numeric"
            />
          </Field>

          <Field label={text.qrisAmount}>
            <input
              className={style.input}
              value={addQris}
              onChange={(e) => setAddQris(e.target.value)}
              placeholder={text.qrisAmount}
              inputMode="numeric"
            />
          </Field>
        </div>

        <button className={style.primaryButton} onClick={handleAdd} type="button">
          {text.addIncome}
        </button>
      </Card>
    </div>
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
  const success = changeFinished && !changeError ? changeSuccessMessage : "";
  const error = changeError ? changeErrorMessage : "";

  return (
    <div className={style.content}>
      <MessageBanner error={error} success={success} />

      <Card title={text.changeIncome}>
        <Field label={text.dailyDate}>
          <input
            className={style.input}
            type="date"
            value={changeDate}
            onChange={(e) => setChangeDate(e.target.value)}
          />
        </Field>

        <div className={style.grid}>
          <Field label={text.cashAmount}>
            <input
              className={style.input}
              value={changeCash}
              onChange={(e) => setChangeCash(e.target.value)}
              placeholder={text.cashAmount}
              inputMode="numeric"
            />
          </Field>

          <Field label={text.fnbAmount}>
            <input
              className={style.input}
              value={changeFnb}
              onChange={(e) => setChangeFnb(e.target.value)}
              placeholder={text.fnbAmount}
              inputMode="numeric"
            />
          </Field>

          <Field label={text.qrisAmount}>
            <input
              className={style.input}
              value={changeQris}
              onChange={(e) => setChangeQris(e.target.value)}
              placeholder={text.qrisAmount}
              inputMode="numeric"
            />
          </Field>
        </div>

        <Field label={text.notes}>
          <input
            className={style.input}
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            placeholder={text.notes}
          />
        </Field>

        <button className={style.primaryButton} onClick={handleChange} type="button">
          {text.changeButton}
        </button>
      </Card>
    </div>
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
  const success = dailyFinished && !dailyError ? dailySuccessMessage : "";
  const error = dailyError ? dailyErrorMessage : "";

  return (
    <div className={style.content}>
      <MessageBanner error={error} success={success} />

      <Card title={text.getDailyIncome}>
        <Field label={text.dailyDate}>
          <input
            className={style.input}
            type="date"
            value={dailyDate}
            onChange={(e) => setDailyDate(e.target.value)}
          />
        </Field>

        <button className={style.primaryButton} onClick={handleDaily} type="button">
          {text.getDailyButton}
        </button>
      </Card>

      {dailyData && !dailyError && (
        <div className={`${style.resultCard} ${style.fadeInUp}`}>
          <MetricCard
            title={text.totals}
            pillLabel={dailyData?.result?.date ? `${text.dailyDate}: ${dailyData.result.date}` : ""}
            items={[
              { key: text.cashAmount, value: dailyData.result.cash ?? 0 },
              { key: text.fnbAmount, value: dailyData.result.fnb ?? 0 },
              { key: text.qrisAmount, value: dailyData.result.qris ?? 0 },
              { key: "Total", value: dailyData.result.total ?? (Number(dailyData.result.cash ?? 0) + Number(dailyData.result.qris ?? 0)) },
            ]}
          />
        </div>
      )}
    </div>
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
  const success = weeklyFinished && !weeklyError ? weeklySuccessMessage : "";
  const error = weeklyError ? weeklyErrorMessage : "";

  const totalIncome = weeklyData?.result?.[0]?.total_income ?? 0;
  const totalFnb = weeklyData?.result?.[1]?.fnb_total ?? 0;
  const totalCash = weeklyData?.result?.[2]?.cash_total ?? 0;
  const totalQris = weeklyData?.result?.[3]?.qris_total ?? 0;
  const totalRental = weeklyData?.result?.[4]?.totalRental ?? 0;
  const count = weeklyData?.result?.[5]?.daily_report?.length ?? 0;

  return (
    <div className={style.content}>
      <MessageBanner error={error} success={success} />

      <Card title={text.getWeeklyIncome}>
        <Field label={text.dailyDate}>
          <input
            className={style.input}
            type="date"
            value={weeklyDate}
            onChange={(e) => setWeeklyDate(e.target.value)}
          />
        </Field>

        <button className={style.primaryButton} onClick={handleWeekly} type="button">
          {text.getWeeklyIncome}
        </button>
      </Card>

      {weeklyData && !weeklyError && (
        <div className={`${style.resultCard} ${style.fadeInUp}`}>
          <MetricCard
            title={text.totals}
            pillLabel={`${text.start}: ${weeklyData.start}  •  ${text.end}: ${weeklyData.end}`}
            items={[
              { key: text.totalIncome, value: totalIncome },
              { key: text.cashAmount, value: totalCash },
              { key: text.qrisAmount, value: totalQris },
              { key: text.fnbAmount, value: totalFnb },
              { key: text.totalRental, value: totalRental },
              { key: text.records, value: count },
            ]}
          />
        </div>
      )}
    </div>
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
  const success = monthlyFinished && !monthlyError ? monthlySuccessMessage : "";
  const error = monthlyError ? monthlyErrorMessage : "";

  const totalIncome = monthlyData?.result?.[0]?.total_income ?? 0;
  const totalFnb = monthlyData?.result?.[1]?.fnb_total ?? 0;
  const totalCash = monthlyData?.result?.[2]?.cash_total ?? 0;
  const totalQris = monthlyData?.result?.[3]?.qris_total ?? 0;
  const totalRental = monthlyData?.result?.[4]?.totalRental ?? 0;
  const count = monthlyData?.result?.[5]?.daily_report?.length ?? 0;

  return (
    <div className={style.content}>
      <MessageBanner error={error} success={success} />

      <Card title={text.getMonthlyIncome}>
        <Field label={text.dailyDate}>
          <input
            className={style.input}
            type="date"
            value={monthlyDate}
            onChange={(e) => setMonthlyDate(e.target.value)}
          />
        </Field>

        <button className={style.primaryButton} onClick={handleMonthly} type="button">
          {text.getMonthlyIncome}
        </button>
      </Card>

      {monthlyData && !monthlyError && (
        <div className={`${style.resultCard} ${style.fadeInUp}`}>
          <MetricCard
            title={text.totals}
            pillLabel={`${text.start}: ${monthlyData.start}  •  ${text.end}: ${monthlyData.end}`}
            items={[
              { key: text.totalIncome, value: totalIncome },
              { key: text.cashAmount, value: totalCash },
              { key: text.qrisAmount, value: totalQris },
              { key: text.fnbAmount, value: totalFnb },
              { key: text.totalRental, value: totalRental },
              { key: text.records, value: count },
            ]}
          />
        </div>
      )}
    </div>
  );
}

function AlltimeIncomePage({
  text,
  handleAlltime,
  alltimeError,
  alltimeErrorMessage,
  alltimeFinished,
  alltimeSuccessMessage,
  alltimeData,
}) {
  const success = alltimeFinished && !alltimeError ? alltimeSuccessMessage : "";
  const error = alltimeError ? alltimeErrorMessage : "";
  const records = alltimeData?.dailyReport?.length ?? 0;
  const total = alltimeData?.alltime_income ?? 0;

  return (
    <div className={style.content}>
      <MessageBanner error={error} success={success} />

      <Card title={text.getAllTimeIncome}>
        <button className={style.primaryButton} onClick={handleAlltime} type="button">
          {text.getAlltimeButton}
        </button>
      </Card>

      {alltimeData && !alltimeError && (
        <div className={`${style.resultCard} ${style.fadeInUp}`}>
          <MetricCard
            title={text.totals}
            pillLabel=""
            items={[
              { key: text.totalIncome, value: total },
              { key: text.records, value: records },
            ]}
          />
        </div>
      )}
    </div>
  );
}

function Income() {
  const [language] = useContext(languageContext);
  const [view, setView] = useState(views.add);
  const text = useMemo(() => TEXT[language ?? "English"], [language]);

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

  // alltime state
  const [alltimeError, setAlltimeError] = useState(false);
  const [alltimeErrorMessage, setAlltimeErrorMessage] = useState("");
  const [alltimeSuccessMessage, setAlltimeSuccessMessage] = useState("");
  const [alltimeFinished, setAlltimeFinished] = useState(false);
  const [alltimeData, setAlltimeData] = useState(null);

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

    const [y, m, d] = changeDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    const cash = Number(changeCash);
    const fnb = Number(changeFnb);
    const qris = Number(changeQris);

    if (Number.isNaN(cash) || Number.isNaN(fnb) || Number.isNaN(qris)) {
      setChangeError(true);
      setChangeErrorMessage("Please enter valid numbers.");
      setChangeFinished(true);
      return;
    }

    const response = await Change(dateForBackend, cash, fnb, qris, changeNote);

    if (response?.error) {
      setChangeError(true);
      setChangeErrorMessage(response.message ?? "Something went wrong.");
      setChangeFinished(true);
      return;
    }

    setChangeFinished(true);
    setChangeSuccessMessage(text.changeSuccessMessage);
  };

  const handleDaily = async () => {
    setDailyFinished(false);
    setDailyError(false);
    setDailyErrorMessage("");
    setDailySuccessMessage("");
    setDailyData(null);

    if (!dailyDate) {
      setDailyError(true);
      setDailyErrorMessage(text.noDailyDateError);
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
    setDailySuccessMessage(text.dailySuccessMessage);
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

  const handleAlltime = async () => {
    setAlltimeFinished(false);
    setAlltimeError(false);
    setAlltimeErrorMessage("");
    setAlltimeSuccessMessage("");
    setAlltimeData(null);

    const response = await Alltime();

    if (response?.error) {
      setAlltimeError(true);
      setAlltimeErrorMessage(response.message ?? "Something went wrong.");
      setAlltimeFinished(true);
      return;
    }

    setAlltimeData(response);
    setAlltimeFinished(true);
    setAlltimeSuccessMessage(text.alltimeSuccessMessage);
  };

  return (
    <div className={style.container}>
      <Navbar />

      <div className={style.header}>
        <h1 className={style.title}>{text.title}</h1>
        <p className={style.subtitle}>{text.subtitle}</p>
        <p className={style.subtext}>{text.helper}</p>
      </div>

      <ButtonViews text={text} view={view} setView={setView} />

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

      {view === views.alltime && (
        <AlltimeIncomePage
          text={text}
          handleAlltime={handleAlltime}
          alltimeError={alltimeError}
          alltimeErrorMessage={alltimeErrorMessage}
          alltimeFinished={alltimeFinished}
          alltimeSuccessMessage={alltimeSuccessMessage}
          alltimeData={alltimeData}
        />
      )}
    </div>
  );
}

export default Income;
