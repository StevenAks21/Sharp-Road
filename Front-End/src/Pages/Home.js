import Navbar from "../Components/Navbar";
import { useEffect, useMemo, useState, useContext } from "react";
import { languageContext } from "../Contexts";
import style from "../Style/Home.module.css";
import { FetchName } from "../Services/Home/FetchName";
import { Daily } from "../Services/Income/Daily";

const TEXT = {
  English: {
    PageTitle: "SharpRoad - Home Page",
    Welcome: "Welcome Back, ",
    subtitle: "Quick dashboard for today and yesterday.",
    loading: "Loading...",
    dailyIncome: "Daily Income",
    todayAndYesterday: "Today and Yesterday",
    date: "Date",
    cash: "Cash",
    qris: "QRIS",
    fnb: "FNB",
    total: "Total",
    notes: "Notes",
    records: "Records",
    failedIncome: "Failed to load income data.",
    noData: "No income data for today or yesterday.",
  },
  Indonesian: {
    PageTitle: "SharpRoad - Halaman Beranda",
    Welcome: "Selamat Datang Kembali, ",
    subtitle: "Dashboard cepat untuk hari ini dan kemarin.",
    loading: "Memuat...",
    dailyIncome: "Pemasukan Harian",
    todayAndYesterday: "Hari ini dan Kemarin",
    date: "Tanggal",
    cash: "Tunai",
    qris: "QRIS",
    fnb: "FNB",
    total: "Total",
    notes: "Catatan",
    records: "Data",
    failedIncome: "Gagal memuat data pemasukan.",
    noData: "Tidak ada data pemasukan untuk hari ini atau kemarin.",
  },
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toBackendDDMMYYYY(dateObj) {
  const d = pad2(dateObj.getDate());
  const m = pad2(dateObj.getMonth() + 1);
  const y = dateObj.getFullYear();
  return `${d}-${m}-${y}`;
}

function formatDateForDisplay(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return dateStr;

  // yyyy-mm-dd -> dd-mm-yyyy
  const iso = dateStr.split("-");
  if (iso.length === 3 && iso[0].length === 4) {
    const [yyyy, mm, dd] = iso;
    return `${dd}-${mm}-${yyyy}`;
  }

  return dateStr;
}

function DailyTable({ title, records, text, fmtNumber }) {
  const safeRecords = (records ?? []).filter(Boolean);

  if (safeRecords.length === 0) return null;

  const sorted = [...safeRecords].sort((a, b) => {
    const ad = a?.date ?? "";
    const bd = b?.date ?? "";
    return bd.localeCompare(ad);
  });

  return (
    <div className={`${style.employeeCard} ${style.reportCard}`}>
      <div className={style.employeeHeader}>
        <div className={style.employeeIdentity}>
          <div className={style.employeeName}>{title}</div>
          <div className={style.employeeMeta}>
            {text.records}: {sorted.length}
          </div>
        </div>

        <div className={style.employeePill}>
          <span className={style.pillLabel}>B/W</span>
          <span className={style.mono}>✓</span>
        </div>
      </div>

      <div className={style.employeeDivider} />

      <div className={style.reportTableWrap}>
        <table className={style.reportTable}>
          <thead>
            <tr>
              <th className={style.thDate}>{text.date}</th>
              <th className={style.thNum}>{text.cash}</th>
              <th className={style.thNum}>{text.qris}</th>
              <th className={style.thNum}>{text.fnb}</th>
              <th className={style.thNum}>{text.total}</th>
              <th className={style.thNotes}>{text.notes}</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r, idx) => {
              const date = formatDateForDisplay(r?.date) || "-";
              const cash = r?.cash ?? 0;
              const qris = r?.qris ?? 0;
              const fnb = r?.fnb ?? 0;
              const total = r?.total ?? 0;
              const notes = (r?.notes ?? "").toString();

              return (
                <tr key={`${r?.date ?? "row"}-${idx}`}>
                  <td className={`${style.tdDate} ${style.mono}`}>{date}</td>
                  <td className={`${style.tdNum} ${style.mono}`}>{fmtNumber(cash)}</td>
                  <td className={`${style.tdNum} ${style.mono}`}>{fmtNumber(qris)}</td>
                  <td className={`${style.tdNum} ${style.mono}`}>{fmtNumber(fnb)}</td>
                  <td className={`${style.tdNum} ${style.tdTotal} ${style.mono}`}>{fmtNumber(total)}</td>
                  <td className={style.tdNotes} title={notes || ""}>
                    {notes || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={style.reportHint}>Tip: scroll sideways on mobile →</div>
    </div>
  );
}

function Home() {
  const [language] = useContext(languageContext);
  const text = useMemo(() => TEXT[language ?? "English"], [language]);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [todayData, setTodayData] = useState(null);
  const [yesterdayData, setYesterdayData] = useState(null);

  const nf = useMemo(() => {
    const locale = language === "Indonesian" ? "id-ID" : "en-US";
    return new Intl.NumberFormat(locale);
  }, [language]);

  const fmtNumber = (v) => {
    const num = Number(v ?? 0);
    if (!Number.isFinite(num)) return "0";
    return nf.format(num);
  };

  const fetchUser = async () => {
    try {
      const userData = await FetchName();
      setUser(userData?.username ?? null);
    } catch (err) {
      // ignore
    }
  };

  const fetchIncome = async () => {
    try {
      setLoading(true);
      setError("");

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const todayBackend = toBackendDDMMYYYY(today);
      const yestBackend = toBackendDDMMYYYY(yesterday);

      const [tRes, yRes] = await Promise.all([Daily(todayBackend), Daily(yestBackend)]);

      if (tRes?.error || yRes?.error) {
        setError(tRes?.message ?? yRes?.message ?? text.failedIncome);
      }

      setTodayData(tRes?.result ?? null);
      setYesterdayData(yRes?.result ?? null);
    } catch (err) {
      setError(text.failedIncome);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = text.PageTitle;
    fetchUser();
    fetchIncome();
  }, [text.PageTitle]);

  const rows = useMemo(() => {
    return [todayData, yesterdayData].filter(Boolean);
  }, [todayData, yesterdayData]);

  return (
    <div>
      <Navbar />

      <div className={style.container}>
        <div className={style.header}>
          <h1 className={style.title}>
            {user ? `${text.Welcome}${user}` : text.PageTitle}
          </h1>
          <p className={style.subtitle}>{text.subtitle}</p>
        </div>

        {loading && <p className={style.subtext}>{text.loading}</p>}
        {error && <p className={style.error}>{error}</p>}

        {!loading && !error && rows.length === 0 && (
          <div className={style.helperCard}>
            <p>{text.noData}</p>
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div className={style.resultsGrid}>
            <DailyTable
              title={`${text.dailyIncome} • ${text.todayAndYesterday}`}
              records={rows}
              text={text}
              fmtNumber={fmtNumber}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;