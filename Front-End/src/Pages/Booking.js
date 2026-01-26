import Navbar from "../Components/Navbar";
import { useEffect, useState, useContext } from "react";
import { languageContext } from "../Contexts";
import { GetAllBookings } from "../Services/Bookings/GetAllBookings";
import { AddBooking } from "../Services/Bookings/AddBooking";
import { GetBookingById } from "../Services/Bookings/GetBookingById";
import { RemoveBookingById } from "../Services/Bookings/RemoveBookingById";
import Style from "../Style/Booking.module.css";

const TEXT = {
  English: {
    PageTitle: "SharpRoad - Booking Page",
    Tabs: {
      All: "Get All Bookings",
      Add: "Add Booking",
      Get: "Get Booking By ID",
      Remove: "Remove Booking By ID",
    },
    Loading: "Loading...",
    SomethingWentWrong: "Something went wrong",
    FailedToLoad: "Failed to load bookings",
    NoBookingFound: "No booking found",
    BookingNotFound: "Booking not found",
    InvalidId: "Please enter a valid booking ID",
    InvalidFields: "Please fill all fields",
    Titles: {
      All: "Bookings",
      Add: "Add Booking",
      Get: "Find Booking",
      Remove: "Remove Booking",
    },
    Labels: {
      Id: "ID",
      Name: "Name",
      Services: "Services",
      ResourceId: "Resource ID",
      StartTime: "Start Time",
      EndTime: "End Time",
    },
    Inputs: {
      Name: "Enter name",
      Id: "Enter booking ID",
    },
    Buttons: {
      Refresh: "Refresh",
      Submit: "Submit",
      Get: "Get Booking",
      Delete: "Delete Booking",
    },
  },
  Indonesian: {
    PageTitle: "SharpRoad - Halaman Booking",
    Tabs: {
      All: "Tampilkan Semua Booking",
      Add: "Tambah Booking",
      Get: "Tampilkan Booking Berdasarkan ID",
      Remove: "Hapus Booking Berdasarkan ID",
    },
    Loading: "Memuat...",
    SomethingWentWrong: "Terjadi kesalahan",
    FailedToLoad: "Gagal memuat booking",
    NoBookingFound: "Tidak ada booking",
    BookingNotFound: "Booking tidak ditemukan",
    InvalidId: "Masukkan ID booking yang valid",
    InvalidFields: "Mohon isi semua field",
    Titles: {
      All: "Booking",
      Add: "Tambah Booking",
      Get: "Cari Booking",
      Remove: "Hapus Booking",
    },
    Labels: {
      Id: "ID",
      Name: "Nama",
      Services: "Layanan",
      ResourceId: "ID Resource",
      StartTime: "Waktu Mulai",
      EndTime: "Waktu Selesai",
    },
    Inputs: {
      Name: "Masukkan nama",
      Id: "Masukkan ID booking",
    },
    Buttons: {
      Refresh: "Muat Ulang",
      Submit: "Kirim",
      Get: "Tampilkan Booking",
      Delete: "Hapus Booking",
    },
  },
};

const VIEWS = {
  ALL: "all",
  ADD: "add",
  GET: "get",
  REMOVE: "remove",
};

function Field({ label, value, placeholder, onChange, disabled = false, type = "text" }) {
  return (
    <div className={Style.field}>
      <label className={Style.label}>{label}</label>
      <input
        className={Style.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        type={type}
      />
    </div>
  );
}

function BookingCard({ booking, text, variant = "list" }) {
  if (!booking) return null;

  return (
    <div className={`${Style.bookingCard} ${variant === "result" ? Style.resultCard : ""}`}>
      <div className={Style.bookingHeader}>
        <div>
          <div className={Style.bookingName}>{booking?.name ?? "-"}</div>
          <div className={Style.bookingMeta}>
            {text.Labels.Id}: <span className={Style.mono}>{booking?.id ?? "-"}</span>
          </div>
        </div>

        <div className={Style.bookingPill} title={text.Labels.Services}>
          <span className={Style.pillLabel}>{text.Labels.Services}</span>
          <span className={Style.mono}>{booking?.services ?? "-"}</span>
        </div>
      </div>

      <div className={Style.bookingDivider} />

      <div className={Style.bookingRows}>
        <div className={Style.bookingRow}>
          <span className={Style.bookingKey}>{text.Labels.ResourceId}</span>
          <span className={Style.bookingVal}>
            <span className={Style.mono}>{booking?.resource_id ?? "-"}</span>
          </span>
        </div>

        <div className={Style.bookingRow}>
          <span className={Style.bookingKey}>{text.Labels.StartTime}</span>
          <span className={Style.bookingVal}>
            <span className={Style.mono}>{booking?.starttime ?? "-"}</span>
          </span>
        </div>

        <div className={Style.bookingRow}>
          <span className={Style.bookingKey}>{text.Labels.EndTime}</span>
          <span className={Style.bookingVal}>
            <span className={Style.mono}>{booking?.endtime ?? "-"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Booking() {
  const [language] = useContext(languageContext);
  const text = TEXT[language ?? "English"];

  const [view, setView] = useState(VIEWS.ALL);

  const [bookings, setBookings] = useState([]);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);

  const [bookingName, setBookingName] = useState("");
  const [bookingServices, setBookingServices] = useState("PS4");
  const [bookingStart, setBookingStart] = useState("");
  const [bookingEnd, setBookingEnd] = useState("");

  const [bookingId, setBookingId] = useState("");
  const [fetchedBooking, setFetchedBooking] = useState(null);
  const [hasSearchedById, setHasSearchedById] = useState(false);

  const [removeId, setRemoveId] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = text.PageTitle;
  }, [text]);

  const resetFeedback = () => {
    setErrorMessage("");
    setMessage("");
  };

  const setActiveView = (nextView) => {
    setView(nextView);
    resetFeedback();

    if (nextView === VIEWS.GET) {
      setBookingId("");
      setFetchedBooking(null);
      setHasSearchedById(false);
    }

    if (nextView === VIEWS.ADD) {
      setBookingName("");
      setBookingServices("PS4");
      setBookingStart("");
      setBookingEnd("");
    }

    if (nextView === VIEWS.REMOVE) {
      setRemoveId("");
    }
  };

  const run = async (fn) => {
    try {
      setLoading(true);
      resetFeedback();
      await fn();
    } catch (err) {
      setErrorMessage(err?.message ?? text.SomethingWentWrong);
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    await run(async () => {
      const result = await GetAllBookings();
      setBookings(Array.isArray(result) ? result : []);
      setHasFetchedAll(true);
      setView(VIEWS.ALL);
    });
  };

  const addBooking = async () => {
    const name = bookingName.trim();
    if (!name || !bookingStart || !bookingEnd || !bookingServices) {
      setErrorMessage(text.InvalidFields);
      return;
    }

    await run(async () => {
      await AddBooking({
        name,
        startTime: bookingStart,
        endTime: bookingEnd,
        services: bookingServices,
      });

      setMessage("Booking added successfully");
      setBookingName("");
      setBookingServices("PS4");
      setBookingStart("");
      setBookingEnd("");

      await fetchAll();
    });
  };

  const getById = async () => {
    const id = bookingId.trim();
    if (!id) {
      setErrorMessage(text.InvalidId);
      setFetchedBooking(null);
      setHasSearchedById(false);
      return;
    }

    await run(async () => {
      const data = await GetBookingById(id);
      const booking = data?.result ?? null;

      setFetchedBooking(booking && booking.id ? booking : null);
      setHasSearchedById(true);
    });
  };

  const removeById = async () => {
    const id = removeId.trim();
    if (!id) {
      setErrorMessage(text.InvalidId);
      return;
    }

    await run(async () => {
      const data = await RemoveBookingById(id);
      setMessage(data?.message || "Booking deleted");
      setRemoveId("");

      if (hasFetchedAll) {
        await fetchAll();
      }
    });
  };

  const title = (() => {
    if (view === VIEWS.ADD) return text.Titles.Add;
    if (view === VIEWS.GET) return text.Titles.Get;
    if (view === VIEWS.REMOVE) return text.Titles.Remove;
    return text.Titles.All;
  })();

  return (
    <div>
      <Navbar />

      <div className={Style.container}>
        <h1 className={Style.title}>{title}</h1>

        <div className={Style.buttonRow}>
          <button
            className={`${Style.button} ${view === VIEWS.ALL ? Style.activeButton : ""}`}
            onClick={fetchAll}
          >
            {text.Tabs.All}
          </button>

          <button
            className={`${Style.button} ${view === VIEWS.ADD ? Style.activeButton : ""}`}
            onClick={() => setActiveView(VIEWS.ADD)}
          >
            {text.Tabs.Add}
          </button>

          <button
            className={`${Style.button} ${view === VIEWS.GET ? Style.activeButton : ""}`}
            onClick={() => setActiveView(VIEWS.GET)}
          >
            {text.Tabs.Get}
          </button>

          <button
            className={`${Style.button} ${view === VIEWS.REMOVE ? Style.activeButton : ""}`}
            onClick={() => setActiveView(VIEWS.REMOVE)}
          >
            {text.Tabs.Remove}
          </button>
        </div>

        {loading && <p className={Style.subtext}>{text.Loading}</p>}
        {errorMessage && <p className={Style.error}>{errorMessage}</p>}
        {message && !errorMessage && <p className={Style.success}>{message}</p>}
        {message && errorMessage && <p className={Style.error}>{message}</p>}

        {view === VIEWS.ALL && (
          <div className={Style.content}>
            <div className={Style.toolbar}>
              <button className={Style.secondaryButton} onClick={fetchAll} disabled={loading}>
                {text.Buttons.Refresh}
              </button>
              <div className={Style.countPill}>
                <span className={Style.mono}>{bookings.length}</span>
                <span className={Style.countLabel}>{text.Titles.All}</span>
              </div>
            </div>

            {hasFetchedAll && !loading && !errorMessage && bookings.length === 0 && (
              <div className={Style.helperCard}>
                <p>{text.NoBookingFound}</p>
              </div>
            )}

            {!loading && !errorMessage && bookings.length > 0 && (
              <div className={Style.grid}>
                {bookings.map((b) => (
                  <BookingCard key={b.id} booking={b} text={text} />
                ))}
              </div>
            )}
          </div>
        )}

        {view === VIEWS.ADD && (
          <div className={Style.card}>
            <p className={Style.cardTitle}>{text.Titles.Add}</p>

            <Field
              label={text.Labels.Name}
              value={bookingName}
              placeholder={text.Inputs.Name}
              onChange={(v) => {
                setBookingName(v);
                resetFeedback();
              }}
              disabled={loading}
            />

            <div className={Style.field}>
              <label className={Style.label}>{text.Labels.Services}</label>
              <select
                className={Style.select}
                value={bookingServices}
                onChange={(e) => {
                  setBookingServices(e.target.value);
                  resetFeedback();
                }}
                disabled={loading}
              >
                <option value="PS4">PS4</option>
                <option value="PS5">PS5</option>
                <option value="PS3">PS3</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <Field
              label={text.Labels.StartTime}
              value={bookingStart}
              onChange={(v) => {
                setBookingStart(v);
                resetFeedback();
              }}
              disabled={loading}
              type="datetime-local"
            />

            <Field
              label={text.Labels.EndTime}
              value={bookingEnd}
              onChange={(v) => {
                setBookingEnd(v);
                resetFeedback();
              }}
              disabled={loading}
              type="datetime-local"
            />

            <button
              className={Style.primaryButton}
              onClick={addBooking}
              disabled={loading || !bookingName.trim() || !bookingStart || !bookingEnd}
            >
              {text.Buttons.Submit}
            </button>
          </div>
        )}

        {view === VIEWS.GET && (
          <div className={Style.content}>
            <div className={Style.card}>
              <p className={Style.cardTitle}>{text.Titles.Get}</p>

              <Field
                label={text.Labels.Id}
                value={bookingId}
                placeholder={text.Inputs.Id}
                onChange={(v) => {
                  setBookingId(v);
                  setFetchedBooking(null);
                  setHasSearchedById(false);
                  resetFeedback();
                }}
                disabled={loading}
              />

              <button
                className={Style.primaryButton}
                onClick={getById}
                disabled={loading || bookingId.trim().length === 0}
              >
                {text.Buttons.Get}
              </button>
            </div>

            {!loading && !errorMessage && fetchedBooking && (
              <BookingCard booking={fetchedBooking} text={text} variant="result" />
            )}

            {!loading && !errorMessage && hasSearchedById && !fetchedBooking && (
              <div className={Style.helperCard}>
                <p>{text.BookingNotFound}</p>
              </div>
            )}
          </div>
        )}

        {view === VIEWS.REMOVE && (
          <div className={Style.card}>
            <p className={Style.cardTitle}>{text.Titles.Remove}</p>

            <Field
              label={text.Labels.Id}
              value={removeId}
              placeholder={text.Inputs.Id}
              onChange={(v) => {
                setRemoveId(v);
                resetFeedback();
              }}
              disabled={loading}
            />

            <button
              className={Style.primaryButtonDanger}
              onClick={removeById}
              disabled={loading || removeId.trim().length === 0}
            >
              {text.Buttons.Delete}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;