import Navbar from "../Components/Navbar";
import { useEffect, useContext, useState } from "react";
import { languageContext } from "../Contexts";
import { GetInfo } from "../Services/UserInfo/UserInfo";
import Style from "../Style/UserInfo.module.css";

const TEXT = {
  English: {
    documentTitle: "SharpRoad - User Info page",
    loading: "Loading...",
    failed: "Failed to load user info.",
    welcome: "Welcome back",
    loggedIn: "Logged in time",
    expiry: "Expiry time",
    remaining: "Time remaining",
    expired: "Expired",
    title: "User Info",
    subtitle: "SharpRoad - User Info page",
  },
  Indonesian: {
    documentTitle: "SharpRoad - Halaman Info Pengguna",
    loading: "Memuat...",
    failed: "Gagal memuat info pengguna.",
    welcome: "Selamat datang kembali",
    loggedIn: "Waktu login",
    expiry: "Waktu kedaluwarsa",
    remaining: "Sisa waktu",
    expired: "Kedaluwarsa",
    title: "Info Pengguna",
    subtitle: "SharpRoad - Halaman Info Pengguna",
  },
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatRemaining(ms, expiredLabel) {
  if (!Number.isFinite(ms)) return "-";
  if (ms <= 0) return expiredLabel;

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const dayPart = days > 0 ? `${days}d ` : "";
  return `${dayPart}${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;
}

function StatRow({ label, value, mono = false }) {
  return (
    <div className={Style.employeeRow}>
      <span className={Style.employeeKey}>{label}</span>
      <span className={`${Style.employeeVal} ${mono ? Style.mono : ""}`}>
        {value}
      </span>
    </div>
  );
}

function UserInfo() {
  const [language] = useContext(languageContext);
  const text = TEXT[language ?? "English"];

  const [user, setUser] = useState({});
  const [loggedInTime, setLoggedInTime] = useState("-");
  const [expiredTime, setExpiredTime] = useState("-");
  const [expiresAtMs, setExpiresAtMs] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("-");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = text.documentTitle;
  }, [text.documentTitle]);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        setLoading(true);
        setErrorMessage("");

        const fetchedUser = await GetInfo();
        if (!isMounted) return;

        setUser(fetchedUser);

        const iatMs = Number(fetchedUser?.iat) * 1000;
        const expMs = Number(fetchedUser?.exp) * 1000;

        if (Number.isFinite(iatMs)) setLoggedInTime(new Date(iatMs).toUTCString());
        else setLoggedInTime("-");

        if (Number.isFinite(expMs)) {
          setExpiredTime(new Date(expMs).toUTCString());
          setExpiresAtMs(expMs);
          setTimeRemaining(formatRemaining(expMs - Date.now(), text.expired));
        } else {
          setExpiredTime("-");
          setExpiresAtMs(null);
          setTimeRemaining("-");
        }
      } catch (err) {
        if (isMounted) setErrorMessage(text.failed);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [text.failed, text.expired]);

  useEffect(() => {
    if (!expiresAtMs) return;

    const tick = () => {
      setTimeRemaining(formatRemaining(expiresAtMs - Date.now(), text.expired));
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [expiresAtMs, text.expired]);

  return (
    <div>
      <Navbar />

      <div className={Style.container}>
        <div className={Style.header}>
          <h1 className={Style.title}>{text.title}</h1>
          <p className={Style.subtitle}>{text.subtitle}</p>
        </div>

        {loading && <p className={Style.subtext}>{text.loading}</p>}
        {errorMessage && <p className={Style.error}>{errorMessage}</p>}

        {!loading && !errorMessage && (
          <div className={Style.card}>
            <p className={Style.cardTitle}>
              {text.welcome}{" "}
              <span className={Style.mono}>{user?.username ?? "-"}</span>
            </p>

            <div className={Style.employeeRows}>
              <StatRow
                label={text.loggedIn}
                value={`${loggedInTime} UTC`}
                mono
              />
              <StatRow label={text.expiry} value={`${expiredTime} UTC`} mono />
              <div className={Style.employeeDivider} />
              <StatRow label={text.remaining} value={timeRemaining} mono />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInfo;