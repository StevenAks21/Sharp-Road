import Navbar from "../Components/Navbar";
import { useEffect, useMemo, useState, useContext } from "react";
import { languageContext } from "../Contexts";
import { GetAll } from "../Services/Employees/GetAll";
import { AddEmployee } from "../Services/Employees/AddEmployee";
import { GetEmployeeById } from "../Services/Employees/GetEmployeeById";
import { RemoveEmployeeById } from "../Services/Employees/RemoveEmployeeById";
import { LogHours } from "../Services/Employees/Loghours";
import Style from "../Style/Employees.module.css";

const TEXT = {
  English: {
    PageTitle: "SharpRoad - Employees Page",
    Tabs: {
      All: "Get All Employees",
      Add: "Add An Employee",
      Get: "Get Employee By ID",
      Remove: "Remove Employee By ID",
      Hours: "Log Work Hours",
    },
    Loading: "Loading...",
    FailedToLoad: "Failed to load employees",
    SomethingWentWrong: "Something went wrong",
    InvalidId: "Please enter a valid employee ID",
    InvalidName: "Please enter a valid employee name",
    NoEmployeeFound: "No employee found",
    EmployeeNotFound: "Employee not found",
    SuccessRemoveFallback: "Employee removed successfully",
    Titles: {
      All: "Employees",
      Add: "Add Employee",
      Get: "Find Employee",
      Remove: "Remove Employee",
      Hours: "Log Work Hours",
    },
    Labels: {
      Id: "ID",
      Name: "Name",
      HoursWorked: "Hours Worked",
      CurrentPay: "Current Pay",
      TotalPay: "Total Pay",
    },
    Inputs: {
      AddName: "Enter employee name",
      GetId: "Enter employee ID",
      RemoveId: "Enter employee ID",
      HoursEmployeeId: "Enter employee ID",
      HoursAmount: "Enter worked hours",
    },
    Buttons: {
      Submit: "Submit",
      GetEmployee: "Get Employee",
      RemoveEmployee: "Remove Employee",
      LogHours: "Log Work Hours",
      Refresh: "Refresh",
    },
    Messages: {
      EmployeeAdded: (name) => `Employee added successfully: ${name}`,
      EmployeeAddFailed: (reason) =>
        `Failed to add employee. ${reason ? `Reason: ${reason}` : ""}`.trim(),

      EmployeeRemoved: (id) => `Employee removed successfully. ID: ${id}`,
      EmployeeRemoveFailed: (reason) =>
        `Failed to remove employee. ${
          reason ? `Reason: ${reason}` : ""
        }`.trim(),

      HoursLogged: (name, hours, pay) =>
        `Hours logged under the name ${name}. Current working hours = ${hours} and current pay = ${pay}`,
      HoursLogFailed: (reason) =>
        `Failed to log work hours. ${reason ? `Reason: ${reason}` : ""}`.trim(),
    },
  },
  Indonesian: {
    PageTitle: "SharpRoad - Halaman Karyawan",
    Tabs: {
      All: "Tampilkan Semua Karyawan",
      Add: "Tambah Karyawan",
      Get: "Tampilkan Karyawan Berdasarkan ID",
      Remove: "Hapus Karyawan Berdasarkan ID",
      Hours: "Catat Jam Kerja",
    },
    Loading: "Memuat...",
    FailedToLoad: "Gagal memuat karyawan",
    SomethingWentWrong: "Terjadi kesalahan",
    InvalidId: "Masukkan ID karyawan yang valid",
    InvalidName: "Masukkan nama karyawan yang valid",
    NoEmployeeFound: "Tidak ada karyawan",
    EmployeeNotFound: "Karyawan tidak ditemukan",
    SuccessRemoveFallback: "Karyawan berhasil dihapus",
    Titles: {
      All: "Karyawan",
      Add: "Tambah Karyawan",
      Get: "Cari Karyawan",
      Remove: "Hapus Karyawan",
      Hours: "Catat Jam Kerja",
    },
    Labels: {
      Id: "ID",
      Name: "Nama",
      HoursWorked: "Jam Kerja",
      CurrentPay: "Gaji Saat Ini",
      TotalPay: "Total Gaji",
    },
    Inputs: {
      AddName: "Masukkan nama karyawan",
      GetId: "Masukkan ID karyawan",
      RemoveId: "Masukkan ID karyawan",
      HoursEmployeeId: "Masukkan ID karyawan",
      HoursAmount: "Masukkan jumlah jam kerja",
    },
    Buttons: {
      Submit: "Kirim",
      GetEmployee: "Tampilkan Karyawan",
      RemoveEmployee: "Hapus Karyawan",
      LogHours: "Catat Jam Kerja",
      Refresh: "Muat Ulang",
    },
    Messages: {
      EmployeeAdded: (name) => `Karyawan berhasil ditambahkan: ${name}`,
      EmployeeAddFailed: (reason) =>
        `Gagal menambahkan karyawan. ${
          reason ? `Alasan: ${reason}` : ""
        }`.trim(),

      EmployeeRemoved: (id) => `Karyawan berhasil dihapus. ID: ${id}`,
      EmployeeRemoveFailed: (reason) =>
        `Gagal menghapus karyawan. ${reason ? `Alasan: ${reason}` : ""}`.trim(),

      HoursLogged: (name, hours, pay) =>
        `Jam kerja dicatat atas nama ${name}. Total jam kerja saat ini = ${hours} dan gaji saat ini = ${pay}`,
      HoursLogFailed: (reason) =>
        `Gagal mencatat jam kerja. ${reason ? `Alasan: ${reason}` : ""}`.trim(),
    },
  },
};

const VIEWS = {
  ALL: "all",
  ADD: "add",
  GET: "get",
  REMOVE: "remove",
  HOURS: "hours",
};

function Field({
  label,
  value,
  placeholder,
  onChange,
  disabled = false,
  type = "text",
}) {
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

function StatRow({ label, value }) {
  return (
    <div className={Style.employeeRow}>
      <span className={Style.employeeKey}>{label}</span>
      <span className={Style.employeeVal}>{value}</span>
    </div>
  );
}

function EmployeeCard({ emp, text, rupiah, variant = "list" }) {
  return (
    <div
      className={`${Style.employeeCard} ${
        variant === "result" ? Style.resultCard : ""
      }`}
    >
      <div className={Style.employeeHeader}>
        <div className={Style.employeeIdentity}>
          <div className={Style.employeeName}>{emp?.name ?? "-"}</div>
          <div className={Style.employeeMeta}>
            {text.Labels.Id}:{" "}
            <span className={Style.mono}>{emp?.id ?? "-"}</span>
          </div>
        </div>

        <div className={Style.employeePill} title={text.Labels.HoursWorked}>
          <span className={Style.pillLabel}>{text.Labels.HoursWorked}</span>
          <span className={Style.mono}>{emp?.hours_worked ?? 0}</span>
        </div>
      </div>

      <div className={Style.employeeDivider} />

      <div className={Style.employeeRows}>
        <StatRow
          label={text.Labels.CurrentPay}
          value={rupiah(emp?.current_pay)}
        />
        <StatRow label={text.Labels.TotalPay} value={rupiah(emp?.total_pay)} />
      </div>
    </div>
  );
}

function Employees() {
  const [language] = useContext(languageContext);
  const text = TEXT[language ?? "English"];

  const [view, setView] = useState(VIEWS.ALL);

  const [employees, setEmployees] = useState([]);
  const [fetchedEmployee, setFetchedEmployee] = useState(null);

  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeToRemoveId, setEmployeeToRemoveId] = useState("");
  const [employeeHoursId, setEmployeeHoursId] = useState("");
  const [employeeHoursAmount, setEmployeeHoursAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const [hasFetchedAll, setHasFetchedAll] = useState(false);
  const [hasSearchedById, setHasSearchedById] = useState(false);

  useEffect(() => {
    document.title = text.PageTitle;
  }, [text]);

  const rupiah = useMemo(() => {
    return (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
  }, []);

  const resetFeedback = () => {
    setErrorMessage("");
    setMessage("");
  };

  const setActiveView = (nextView) => {
    setView(nextView);
    resetFeedback();

    if (nextView === VIEWS.GET) {
      setFetchedEmployee(null);
      setEmployeeId("");
      setHasSearchedById(false);
    }

    if (nextView === VIEWS.ADD) setEmployeeName("");
    if (nextView === VIEWS.REMOVE) setEmployeeToRemoveId("");
    if (nextView === VIEWS.HOURS) {
      setEmployeeHoursId("");
      setEmployeeHoursAmount("");
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

  const fetchAllEmployees = async () => {
    await run(async () => {
      const data = await GetAll();
      setEmployees(Array.isArray(data) ? data : []);
      setHasFetchedAll(true);
      setView(VIEWS.ALL);
    });
  };

  const addEmployee = async () => {
    const name = employeeName.trim();
    if (!name) {
      setErrorMessage(text.InvalidName);
      setMessage(text.Messages.EmployeeAddFailed(text.InvalidName));
      return;
    }

    try {
      setLoading(true);
      resetFeedback();

      await AddEmployee(name);

      setMessage(text.Messages.EmployeeAdded(name));
      setErrorMessage("");
      setEmployeeName("");
    } catch (err) {
      const reason = err?.message ?? text.SomethingWentWrong;
      setErrorMessage(reason);
      setMessage(text.Messages.EmployeeAddFailed(reason));
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeById = async () => {
    const id = employeeId.trim();
    if (!id) {
      setErrorMessage(text.InvalidId);
      setFetchedEmployee(null);
      setHasSearchedById(false);
      return;
    }

    await run(async () => {
      const data = await GetEmployeeById(id);
      const emp = data?.result ?? data?.employee ?? data;
      setFetchedEmployee(emp && emp.id ? emp : null);
      setMessage(data?.message ?? "");
      setHasSearchedById(true);
    });
  };

  const removeEmployeeById = async () => {
    const id = employeeToRemoveId.trim();
    if (!id) {
      setErrorMessage(text.InvalidId);
      setMessage(text.Messages.EmployeeRemoveFailed(text.InvalidId));
      return;
    }

    try {
      setLoading(true);
      resetFeedback();

      const data = await RemoveEmployeeById(id);
      const apiMsg = data?.message;

      setMessage(apiMsg ?? text.Messages.EmployeeRemoved(id));
      setErrorMessage("");
      setEmployeeToRemoveId("");
    } catch (err) {
      const reason = err?.message ?? text.SomethingWentWrong;
      setErrorMessage(reason);
      setMessage(text.Messages.EmployeeRemoveFailed(reason));
    } finally {
      setLoading(false);
    }
  };

  const logWorkHours = async () => {
    const id = employeeHoursId.trim();
    const hours = employeeHoursAmount.trim();

    if (!id) {
      setErrorMessage(text.InvalidId);
      setMessage(text.Messages.HoursLogFailed(text.InvalidId));
      return;
    }

    try {
      setLoading(true);
      resetFeedback();

      const data = await LogHours(id, hours);

      const name = data?.result?.name ?? "-";
      const worked = data?.result?.hours_worked ?? "-";
      const pay = rupiah(data?.result?.current_pay);

      setMessage(text.Messages.HoursLogged(name, worked, pay));
      setErrorMessage("");
    } catch (err) {
      const reason = err?.message ?? text.SomethingWentWrong;
      setErrorMessage(reason);
      setMessage(text.Messages.HoursLogFailed(reason));
    } finally {
      setLoading(false);
    }
  };

  const title = (() => {
    if (view === VIEWS.ADD) return text.Titles.Add;
    if (view === VIEWS.GET) return text.Titles.Get;
    if (view === VIEWS.REMOVE) return text.Titles.Remove;
    if (view === VIEWS.HOURS) return text.Titles.Hours;
    return text.Titles.All;
  })();

  return (
    <div>
      <Navbar />

      <div className={Style.container}>
        <div className={Style.header}>
          <h1 className={Style.title}>{title}</h1>
          <p className={Style.subtitle}>{text.PageTitle}</p>
        </div>

        <div className={Style.buttonRow}>
          <button
            className={`${Style.button} ${
              view === VIEWS.ALL ? Style.activeButton : ""
            }`}
            onClick={fetchAllEmployees}
          >
            {text.Tabs.All}
          </button>

          <button
            className={`${Style.button} ${
              view === VIEWS.ADD ? Style.activeButton : ""
            }`}
            onClick={() => setActiveView(VIEWS.ADD)}
          >
            {text.Tabs.Add}
          </button>

          <button
            className={`${Style.button} ${
              view === VIEWS.GET ? Style.activeButton : ""
            }`}
            onClick={() => setActiveView(VIEWS.GET)}
          >
            {text.Tabs.Get}
          </button>

          <button
            className={`${Style.button} ${
              view === VIEWS.REMOVE ? Style.activeButton : ""
            }`}
            onClick={() => setActiveView(VIEWS.REMOVE)}
          >
            {text.Tabs.Remove}
          </button>

          <button
            className={`${Style.button} ${
              view === VIEWS.HOURS ? Style.activeButton : ""
            }`}
            onClick={() => setActiveView(VIEWS.HOURS)}
          >
            {text.Tabs.Hours}
          </button>
        </div>

        {loading && <p className={Style.subtext}>{text.Loading}</p>}
        {errorMessage && <p className={Style.error}>{errorMessage}</p>}
        {message && !errorMessage && <p className={Style.success}>{message}</p>}
        {message && errorMessage && <p className={Style.error}>{message}</p>}

        {view === VIEWS.ALL && (
          <div className={Style.content}>
            <div className={Style.toolbar}>
              <button
                className={Style.secondaryButton}
                onClick={fetchAllEmployees}
                disabled={loading}
              >
                {text.Buttons.Refresh}
              </button>
              <div className={Style.countPill}>
                <span className={Style.mono}>{employees.length}</span>
                <span className={Style.countLabel}>{text.Titles.All}</span>
              </div>
            </div>

            {hasFetchedAll &&
              !loading &&
              !errorMessage &&
              employees.length === 0 && (
                <div className={Style.helperCard}>
                  <p>{text.NoEmployeeFound}</p>
                </div>
              )}

            {!loading && !errorMessage && employees.length > 0 && (
              <div className={Style.grid}>
                {employees.map((emp) => (
                  <EmployeeCard
                    key={emp.id}
                    emp={emp}
                    text={text}
                    rupiah={rupiah}
                  />
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
              value={employeeName}
              placeholder={text.Inputs.AddName}
              onChange={(v) => {
                setEmployeeName(v);
                resetFeedback();
              }}
              disabled={loading}
            />

            <button
              className={Style.primaryButton}
              onClick={addEmployee}
              disabled={loading || employeeName.trim().length === 0}
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
                value={employeeId}
                placeholder={text.Inputs.GetId}
                onChange={(v) => {
                  setEmployeeId(v);
                  setHasSearchedById(false);
                  setFetchedEmployee(null);
                  resetFeedback();
                }}
                disabled={loading}
              />

              <button
                className={Style.primaryButton}
                onClick={getEmployeeById}
                disabled={loading || employeeId.trim().length === 0}
              >
                {text.Buttons.GetEmployee}
              </button>
            </div>

            {!loading && !errorMessage && fetchedEmployee && (
              <EmployeeCard
                emp={fetchedEmployee}
                text={text}
                rupiah={rupiah}
                variant="result"
              />
            )}

            {!loading &&
              !errorMessage &&
              hasSearchedById &&
              !fetchedEmployee && (
                <div className={Style.helperCard}>
                  <p>{text.EmployeeNotFound}</p>
                </div>
              )}
          </div>
        )}

        {view === VIEWS.REMOVE && (
          <div className={Style.card}>
            <p className={Style.cardTitle}>{text.Titles.Remove}</p>

            <Field
              label={text.Labels.Id}
              value={employeeToRemoveId}
              placeholder={text.Inputs.RemoveId}
              onChange={(v) => {
                setEmployeeToRemoveId(v);
                resetFeedback();
              }}
              disabled={loading}
            />

            <button
              className={Style.primaryButtonDanger}
              onClick={removeEmployeeById}
              disabled={loading || employeeToRemoveId.trim().length === 0}
            >
              {text.Buttons.RemoveEmployee}
            </button>
          </div>
        )}

        {view === VIEWS.HOURS && (
          <div className={Style.card}>
            <p className={Style.cardTitle}>{text.Titles.Hours}</p>

            <Field
              label={text.Labels.Id}
              value={employeeHoursId}
              placeholder={text.Inputs.HoursEmployeeId}
              onChange={(v) => {
                setEmployeeHoursId(v);
                resetFeedback();
              }}
              disabled={loading}
            />

            <Field
              label={text.Labels.HoursWorked}
              value={employeeHoursAmount}
              placeholder={text.Inputs.HoursAmount}
              onChange={(v) => {
                setEmployeeHoursAmount(v);
                resetFeedback();
              }}
              disabled={loading}
              type="number"
            />

            <button
              className={Style.primaryButton}
              onClick={logWorkHours}
              disabled={
                loading ||
                employeeHoursId.trim().length === 0 ||
                employeeHoursAmount.trim().length === 0
              }
            >
              {text.Buttons.LogHours}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;
