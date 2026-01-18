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
    documentTitle: "SharpRoad - Income Management",
    title: "Income Management",
    subtitle:
      "Track, update, and review income in a clean black and white dashboard.",

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
    loading: "Loading...",
  },
  Indonesian: {
    documentTitle: "SharpRoad - Manajemen Pemasukan",
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
    loading: "Memuat...",
  },
};

function Field({ label, value, placeholder, onChange, disabled = false, type = "text" }) {
  return (
    <div className={style.field}>
      <label className={style.label}>{label}</label>
      <input
        className={style.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        type={type}
      />
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className={style.employeeRow}>
      <span className={style.employeeKey}>{label}</span>
      <span className={`${style.employeeVal} ${style.mono}`}>{value}</span>
    </div>
  );
}

function TotalsCard({ title, subtitle, rows }) {
  return (
    <div className={`${style.employeeCard} ${style.resultCard}`}>
      <div className={style.employeeHeader}>
        <div className={style.employeeIdentity}>
          <div className={style.employeeName}>{title}</div>
          {subtitle ? <div className={style.employeeMeta}>{subtitle}</div> : null}
        </div>

        <div className={style.employeePill}>
          <span className={style.pillLabel}>B/W</span>
          <span className={style.mono}>✓</span>
        </div>
      </div>

      <div className={style.employeeDivider} />

      <div className={style.employeeRows}>
        {rows.map((r) => (
          <StatRow key={r.label} label={r.label} value={r.value} />
        ))}
      </div>
    </div>
  );
}

function Income() {
  const [language] = useContext(languageContext);
  const text = useMemo(() => TEXT[language ?? "English"], [language]);
  const [view, setView] = useState(views.add);

  useEffect(() => {
    document.title = text.documentTitle;
  }, [text.documentTitle]);

  const [loading, setLoading] = useState(false);

  // add income state
  const [addDate, setAddDate] = useState("");
  const [addCash, setAddCash] = useState("");
  const [addQris, setAddQris] = useState("");
  const [addFnb, setAddFnb] = useState("");
  const [addError, setAddError] = useState("");
  const [addMessage, setAddMessage] = useState("");

  // change income state
  const [changeDate, setChangeDate] = useState("");
  const [changeCash, setChangeCash] = useState("");
  const [changeQris, setChangeQris] = useState("");
  const [changeFnb, setChangeFnb] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [changeError, setChangeError] = useState("");
  const [changeMessage, setChangeMessage] = useState("");

  // daily income state
  const [dailyDate, setDailyDate] = useState("");
  const [dailyError, setDailyError] = useState("");
  const [dailyMessage, setDailyMessage] = useState("");
  const [dailyData, setDailyData] = useState(null);

  // weekly state
  const [weeklyDate, setWeeklyDate] = useState("");
  const [weeklyError, setWeeklyError] = useState("");
  const [weeklyMessage, setWeeklyMessage] = useState("");
  const [weeklyData, setWeeklyData] = useState(null);

  // monthly state
  const [monthlyDate, setMonthlyDate] = useState("");
  const [monthlyError, setMonthlyError] = useState("");
  const [monthlyMessage, setMonthlyMessage] = useState("");
  const [monthlyData, setMonthlyData] = useState(null);

  // alltime state
  const [alltimeError, setAlltimeError] = useState("");
  const [alltimeMessage, setAlltimeMessage] = useState("");
  const [alltimeData, setAlltimeData] = useState(null);

  const resetFeedback = () => {
    setAddError("");
    setAddMessage("");
    setChangeError("");
    setChangeMessage("");
    setDailyError("");
    setDailyMessage("");
    setWeeklyError("");
    setWeeklyMessage("");
    setMonthlyError("");
    setMonthlyMessage("");
    setAlltimeError("");
    setAlltimeMessage("");
  };

  const setActiveView = (nextView) => {
    setView(nextView);
    resetFeedback();

    if (nextView === views.daily) setDailyData(null);
    if (nextView === views.weekly) setWeeklyData(null);
    if (nextView === views.monthly) setMonthlyData(null);
    if (nextView === views.alltime) setAlltimeData(null);
  };

  const run = async (fn) => {
    try {
      setLoading(true);
      resetFeedback();
      await fn();
    } catch (err) {
      // fallback, per view handlers set their own messages
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!addDate) return;

    const [y, m, d] = addDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    const cash = Number(addCash);
    const fnb = Number(addFnb);
    const qris = Number(addQris);

    if (Number.isNaN(cash) || Number.isNaN(fnb) || Number.isNaN(qris)) {
      setAddError("Please enter valid numbers.");
      return;
    }

    await run(async () => {
      const response = await Add(dateForBackend, cash, fnb, qris);

      if (response?.error) {
        setAddError(response.message ?? "Something went wrong.");
        return;
      }

      setAddMessage(text.addSuccessMessage);
    });
  };

  const handleChange = async () => {
    if (!changeDate) return;

    const [y, m, d] = changeDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    const cash = Number(changeCash);
    const fnb = Number(changeFnb);
    const qris = Number(changeQris);

    if (Number.isNaN(cash) || Number.isNaN(fnb) || Number.isNaN(qris)) {
      setChangeError("Please enter valid numbers.");
      return;
    }

    await run(async () => {
      const response = await Change(dateForBackend, cash, fnb, qris, changeNote);

      if (response?.error) {
        setChangeError(response.message ?? "Something went wrong.");
        return;
      }

      setChangeMessage(text.changeSuccessMessage);
    });
  };

  const handleDaily = async () => {
    if (!dailyDate) {
      setDailyError(text.noDailyDateError);
      return;
    }

    const [y, m, d] = dailyDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    await run(async () => {
      const response = await Daily(dateForBackend);

      if (response?.error) {
        setDailyError(response.message ?? "Something went wrong.");
        return;
      }

      setDailyData(response);
      setDailyMessage(text.dailySuccessMessage);
    });
  };

  const handleWeekly = async () => {
    if (!weeklyDate) {
      setWeeklyError(text.noWeeklyDateError);
      return;
    }

    const [y, m, d] = weeklyDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    await run(async () => {
      const response = await Weekly(dateForBackend);

      if (response?.error) {
        setWeeklyError(response.message ?? "Something went wrong.");
        return;
      }

      setWeeklyData(response);
      setWeeklyMessage(text.weeklySuccessMessage);
    });
  };

  const handleMonthly = async () => {
    if (!monthlyDate) {
      setMonthlyError(text.noMonthlyDateError);
      return;
    }

    const [y, m, d] = monthlyDate.split("-");
    const dateForBackend = `${d}-${m}-${y}`;

    await run(async () => {
      const response = await Monthly(dateForBackend);

      if (response?.error) {
        setMonthlyError(response.message ?? "Something went wrong.");
        return;
      }

      setMonthlyData(response);
      setMonthlyMessage(text.monthlySuccessMessage);
    });
  };

  const handleAlltime = async () => {
    await run(async () => {
      const response = await Alltime();

      if (response?.error) {
        setAlltimeError(response.message ?? "Something went wrong.");
        return;
      }

      setAlltimeData(response);
      setAlltimeMessage(text.alltimeSuccessMessage);
    });
  };

  const title = (() => {
    if (view === views.add) return text.addIncome;
    if (view === views.change) return text.changeIncome;
    if (view === views.daily) return text.getDailyIncome;
    if (view === views.weekly) return text.getWeeklyIncome;
    if (view === views.monthly) return text.getMonthlyIncome;
    return text.getAllTimeIncome;
  })();

  return (
    <div>
      <Navbar />

      <div className={style.container}>
        <div className={style.header}>
          <h1 className={style.title}>{title}</h1>
          <p className={style.subtitle}>{text.documentTitle}</p>
        </div>

        <div className={style.buttonRow}>
          <button
            className={`${style.button} ${view === views.add ? style.activeButton : ""}`}
            onClick={() => setActiveView(views.add)}
            disabled={loading}
          >
            {text.addIncome}
          </button>

          <button
            className={`${style.button} ${view === views.change ? style.activeButton : ""}`}
            onClick={() => setActiveView(views.change)}
            disabled={loading}
          >
            {text.changeIncome}
          </button>

          <button
            className={`${style.button} ${view === views.daily ? style.activeButton : ""}`}
            onClick={() => setActiveView(views.daily)}
            disabled={loading}
          >
            {text.getDailyIncome}
          </button>

          <button
            className={`${style.button} ${view === views.weekly ? style.activeButton : ""}`}
            onClick={() => setActiveView(views.weekly)}
            disabled={loading}
          >
            {text.getWeeklyIncome}
          </button>

          <button
            className={`${style.button} ${view === views.monthly ? style.activeButton : ""}`}
            onClick={() => setActiveView(views.monthly)}
            disabled={loading}
          >
            {text.getMonthlyIncome}
          </button>

          <button
            className={`${style.button} ${view === views.alltime ? style.activeButton : ""}`}
            onClick={() => setActiveView(views.alltime)}
            disabled={loading}
          >
            {text.getAllTimeIncome}
          </button>
        </div>

        {loading && <p className={style.subtext}>{text.loading}</p>}

        {view === views.add && (
          <div className={style.card}>
            <p className={style.cardTitle}>{text.addIncome}</p>

            {addError && <p className={style.error}>{addError}</p>}
            {addMessage && !addError && <p className={style.success}>{addMessage}</p>}

            <Field
              label={text.dailyDate}
              value={addDate}
              placeholder=""
              onChange={setAddDate}
              disabled={loading}
              type="date"
            />

            <Field
              label={text.cashAmount}
              value={addCash}
              placeholder={text.cashAmount}
              onChange={setAddCash}
              disabled={loading}
              type="number"
            />

            <Field
              label={text.fnbAmount}
              value={addFnb}
              placeholder={text.fnbAmount}
              onChange={setAddFnb}
              disabled={loading}
              type="number"
            />

            <Field
              label={text.qrisAmount}
              value={addQris}
              placeholder={text.qrisAmount}
              onChange={setAddQris}
              disabled={loading}
              type="number"
            />

            <button
              className={style.primaryButton}
              onClick={handleAdd}
              disabled={loading || !addDate}
            >
              {text.addIncome}
            </button>
          </div>
        )}

        {view === views.change && (
          <div className={style.card}>
            <p className={style.cardTitle}>{text.changeIncome}</p>

            {changeError && <p className={style.error}>{changeError}</p>}
            {changeMessage && !changeError && (
              <p className={style.success}>{changeMessage}</p>
            )}

            <Field
              label={text.dailyDate}
              value={changeDate}
              placeholder=""
              onChange={setChangeDate}
              disabled={loading}
              type="date"
            />

            <Field
              label={text.cashAmount}
              value={changeCash}
              placeholder={text.cashAmount}
              onChange={setChangeCash}
              disabled={loading}
              type="number"
            />

            <Field
              label={text.fnbAmount}
              value={changeFnb}
              placeholder={text.fnbAmount}
              onChange={setChangeFnb}
              disabled={loading}
              type="number"
            />

            <Field
              label={text.qrisAmount}
              value={changeQris}
              placeholder={text.qrisAmount}
              onChange={setChangeQris}
              disabled={loading}
              type="number"
            />

            <Field
              label={text.notes}
              value={changeNote}
              placeholder={text.notes}
              onChange={setChangeNote}
              disabled={loading}
              type="text"
            />

            <button
              className={style.primaryButton}
              onClick={handleChange}
              disabled={loading || !changeDate}
            >
              {text.changeButton}
            </button>
          </div>
        )}

        {view === views.daily && (
          <div className={style.content}>
            <div className={style.card}>
              <p className={style.cardTitle}>{text.getDailyIncome}</p>

              {dailyError && <p className={style.error}>{dailyError}</p>}
              {dailyMessage && !dailyError && (
                <p className={style.success}>{dailyMessage}</p>
              )}

              <Field
                label={text.dailyDate}
                value={dailyDate}
                placeholder=""
                onChange={(v) => {
                  setDailyDate(v);
                  setDailyData(null);
                  resetFeedback();
                }}
                disabled={loading}
                type="date"
              />

              <button
                className={style.primaryButton}
                onClick={handleDaily}
                disabled={loading || !dailyDate}
              >
                {text.getDailyButton}
              </button>
            </div>

            {!loading && !dailyError && dailyData?.result && (
              <TotalsCard
                title={text.totals}
                subtitle={`${text.dailyDate}: ${dailyData.result.date ?? "-"}`}
                rows={[
                  { label: text.cashAmount, value: dailyData.result.cash ?? 0 },
                  { label: text.qrisAmount, value: dailyData.result.qris ?? 0 },
                  { label: text.fnbAmount, value: dailyData.result.fnb ?? 0 },
                  { label: "Total", value: dailyData.result.total ?? 0 },
                ]}
              />
            )}
          </div>
        )}

        {view === views.weekly && (
          <div className={style.content}>
            <div className={style.card}>
              <p className={style.cardTitle}>{text.getWeeklyIncome}</p>

              {weeklyError && <p className={style.error}>{weeklyError}</p>}
              {weeklyMessage && !weeklyError && (
                <p className={style.success}>{weeklyMessage}</p>
              )}

              <Field
                label={text.dailyDate}
                value={weeklyDate}
                placeholder=""
                onChange={(v) => {
                  setWeeklyDate(v);
                  setWeeklyData(null);
                  resetFeedback();
                }}
                disabled={loading}
                type="date"
              />

              <button
                className={style.primaryButton}
                onClick={handleWeekly}
                disabled={loading || !weeklyDate}
              >
                {text.getWeeklyIncome}
              </button>
            </div>

            {!loading && !weeklyError && weeklyData?.result && (
              <TotalsCard
                title={text.totals}
                subtitle={`${text.start}: ${weeklyData.start} • ${text.end}: ${weeklyData.end}`}
                rows={[
                  { label: text.totalIncome, value: weeklyData?.result?.[0]?.total_income ?? 0 },
                  { label: text.cashAmount, value: weeklyData?.result?.[2]?.cash_total ?? 0 },
                  { label: text.qrisAmount, value: weeklyData?.result?.[3]?.qris_total ?? 0 },
                  { label: text.fnbAmount, value: weeklyData?.result?.[1]?.fnb_total ?? 0 },
                  { label: text.totalRental, value: weeklyData?.result?.[4]?.totalRental ?? 0 },
                  { label: text.records, value: weeklyData?.result?.[5]?.daily_report?.length ?? 0 },
                ]}
              />
            )}
          </div>
        )}

        {view === views.monthly && (
          <div className={style.content}>
            <div className={style.card}>
              <p className={style.cardTitle}>{text.getMonthlyIncome}</p>

              {monthlyError && <p className={style.error}>{monthlyError}</p>}
              {monthlyMessage && !monthlyError && (
                <p className={style.success}>{monthlyMessage}</p>
              )}

              <Field
                label={text.dailyDate}
                value={monthlyDate}
                placeholder=""
                onChange={(v) => {
                  setMonthlyDate(v);
                  setMonthlyData(null);
                  resetFeedback();
                }}
                disabled={loading}
                type="date"
              />

              <button
                className={style.primaryButton}
                onClick={handleMonthly}
                disabled={loading || !monthlyDate}
              >
                {text.getMonthlyIncome}
              </button>
            </div>

            {!loading && !monthlyError && monthlyData?.result && (
              <TotalsCard
                title={text.totals}
                subtitle={`${text.start}: ${monthlyData.start} • ${text.end}: ${monthlyData.end}`}
                rows={[
                  { label: text.totalIncome, value: monthlyData?.result?.[0]?.total_income ?? 0 },
                  { label: text.cashAmount, value: monthlyData?.result?.[2]?.cash_total ?? 0 },
                  { label: text.qrisAmount, value: monthlyData?.result?.[3]?.qris_total ?? 0 },
                  { label: text.fnbAmount, value: monthlyData?.result?.[1]?.fnb_total ?? 0 },
                  { label: text.totalRental, value: monthlyData?.result?.[4]?.totalRental ?? 0 },
                  { label: text.records, value: monthlyData?.result?.[5]?.daily_report?.length ?? 0 },
                ]}
              />
            )}
          </div>
        )}

        {view === views.alltime && (
          <div className={style.content}>
            {alltimeError && <p className={style.error}>{alltimeError}</p>}
            {alltimeMessage && !alltimeError && (
              <p className={style.success}>{alltimeMessage}</p>
            )}

            <div className={style.toolbar}>
              <button
                className={style.secondaryButton}
                onClick={handleAlltime}
                disabled={loading}
              >
                {text.getAlltimeButton}
              </button>

              <div className={style.countPill}>
                <span className={style.mono}>
                  {alltimeData?.dailyReport?.length ?? 0}
                </span>
                <span className={style.countLabel}>{text.records}</span>
              </div>
            </div>

            {!loading && !alltimeError && alltimeData && (
              <TotalsCard
                title={text.totals}
                subtitle=""
                rows={[
                  { label: text.totalIncome, value: alltimeData.alltime_income ?? 0 },
                  { label: text.records, value: alltimeData.dailyReport?.length ?? 0 },
                ]}
              />
            )}

            {!loading && !alltimeError && !alltimeData && (
              <div className={style.helperCard}>
                <p>{text.helper}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Income;
