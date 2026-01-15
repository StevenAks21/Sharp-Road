import Navbar from "../Components/Navbar";
import { useState, useEffect, useContext } from "react";
import { languageContext } from "../Contexts";
import { GetAll } from "../Services/Employees/GetAll";
import { AddEmployee } from "../Services/Employees/AddEmployee";
import { GetEmployeeById } from "../Services/Employees/GetEmployeeById";
import { RemoveEmployeeById } from "../Services/Employees/RemoveEmployeeById";
import Style from "../Style/Employees.module.css";

const TEXT = {
    English: {
        PageTitle: "SharpRoad - Employees Page",
        ButtonAllEmployees: "Get All Employees",
        ButtonAddEmployee: "Add An Employee",
        ButtonGetEmployee: "Get Employee By ID",
        ButtonRemoveEmployee: "Remove Employee By ID",
        ButtonLogHours: "Log Work Hours",
        NoEmployeeFound: "No employee found",
        Loading: "Loading...",
        FailedToLoad: "Failed to load employees",
        AddPlaceholder: "Enter employee name",
        AddEmployeeButton: "Submit",
        AddTitle: "Add Employee",
        AllTitle: "Employees",
        Labels: {
            Id: "ID",
            Name: "Name",
            HoursWorked: "Hours Worked",
            CurrentPay: "Current Pay",
            TotalPay: "Total Pay",
        },
        GetButton: "Get Employee",
        EnterId: "Enter employee ID",
        NotFound: "Employee not found",
        InvalidId: "Please enter a valid employee ID",
        RemoveEmployeeButton: "Remove Employee",
        RemoveEmployeeInputPlaceholder: "Enter the ID",
    },
    Indonesian: {
        PageTitle: "SharpRoad - Halaman Karyawan",
        ButtonAllEmployees: "Tampilkan Semua Karyawan",
        ButtonAddEmployee: "Tambah Karyawan",
        ButtonGetEmployee: "Tampilkan Karyawan Berdasarkan ID",
        ButtonRemoveEmployee: "Hapus Karyawan Berdasarkan ID",
        ButtonLogHours: "Catat Jam Kerja",
        NoEmployeeFound: "Tidak ada karyawan",
        Loading: "Memuat...",
        FailedToLoad: "Gagal memuat karyawan",
        AddPlaceholder: "Masukkan nama karyawan",
        AddEmployeeButton: "Kirim",
        AddTitle: "Tambah Karyawan",
        AllTitle: "Karyawan",
        Labels: {
            Id: "ID",
            Name: "Nama",
            HoursWorked: "Jam Kerja",
            CurrentPay: "Gaji Saat Ini",
            TotalPay: "Total Gaji",
        },
        GetButton: "Tampilkan Karyawan",
        EnterId: "Masukkan ID karyawan",
        NotFound: "Karyawan tidak ditemukan",
        InvalidId: "Masukkan ID karyawan yang valid",
        RemoveEmployeeButton: "Hapus Karyawan",
        RemoveEmployeeInputPlaceholder: "Masukkan ID karyawan",
    },
};

function Employees() {
    const [language] = useContext(languageContext);
    const text = TEXT[language ?? "English"];

    const [currentView, setCurrentView] = useState("all"); // "all" | "add" | "get" | "remove" | "hours"
    const [employees, setEmployees] = useState([]);

    const [employeeName, setEmployeeName] = useState("");

    const [employeeId, setEmployeeId] = useState("");

    const [fetchedEmployee, setFetchedEmployee] = useState(null);

    const [employeeToRemoveId, setEmployeeToRemoveId] = useState("");
    const [message, setMessage] = useState("");

    const [employeeHoursId, setEmployeeHoursId] = useState("");
    const [employeeHoursAmount, setEmployeeHoursAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [hasFetchedAll, setHasFetchedAll] = useState(false);

    // Key fix: only show "not found" after pressing the button
    const [hasSearchedById, setHasSearchedById] = useState(false);

    useEffect(() => {
        document.title = text.PageTitle;
    }, [text]);

    const rupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

    const handleGetAllEmployees = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const data = await GetAll();
            setEmployees(Array.isArray(data) ? data : []);
            setCurrentView("all");
        } catch {
            setEmployees([]);
            setErrorMessage(text.FailedToLoad);
        } finally {
            setHasFetchedAll(true);
            setLoading(false);
        }
    };

    const handleAddEmployee = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            await AddEmployee(employeeName);
            setEmployeeName("");
            await handleGetAllEmployees();
        } catch (err) {
            setErrorMessage(err?.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGetEmployeeById = async () => {
        const id = employeeId.trim();
        if (!id) {
            setErrorMessage(text.InvalidId);
            setFetchedEmployee(null);
            setHasSearchedById(false);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            setMessage("")

            const data = await GetEmployeeById(id);
            setMessage(data?.message ?? '')

            const emp = data?.result ?? data?.employee ?? data;
            setFetchedEmployee(emp && emp.id ? emp : null);
        } catch (err) {
            setFetchedEmployee(null);
            setErrorMessage(err?.message ?? "Something went wrong");
        } finally {
            setHasSearchedById(true);
            setLoading(false);
        }
    };

    const handleRemoveEmployeeById = async () => {
        const id = employeeToRemoveId.trim();
        if (!id) {
            setErrorMessage(text.InvalidId);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            setMessage("");

            const data = await RemoveEmployeeById(id);
            setMessage(data?.message || "Employee removed successfully");
        } catch (err) {
            setErrorMessage(err?.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleLogWorkHours = async () => {
        
    }

    const title = currentView === "add" ? text.AddTitle : text.AllTitle;

    return (
        <div>
            <Navbar />

            <div className={Style.container}>
                <h1 className={Style.title}>{title}</h1>

                <div className={Style.buttonRow}>
                    <button
                        className={`${Style.button} ${currentView === "all" ? Style.activeButton : ""}`}
                        onClick={handleGetAllEmployees}
                    >
                        {text.ButtonAllEmployees}
                    </button>

                    <button
                        className={`${Style.button} ${currentView === "add" ? Style.activeButton : ""}`}
                        onClick={() => {
                            setCurrentView("add");
                            setErrorMessage("");
                        }}
                    >
                        {text.ButtonAddEmployee}
                    </button>

                    <button
                        className={`${Style.button} ${currentView === "get" ? Style.activeButton : ""}`}
                        onClick={() => {
                            setCurrentView("get");
                            setErrorMessage("");
                            setFetchedEmployee(null);
                            setEmployeeId("");
                            setHasSearchedById(false);
                        }}
                    >
                        {text.ButtonGetEmployee}
                    </button>

                    <button
                        className={`${Style.button} ${currentView === "remove" ? Style.activeButton : ""}`}
                        onClick={() => setCurrentView("remove")}
                    >
                        {text.ButtonRemoveEmployee}
                    </button>

                    <button
                        className={`${Style.button} ${currentView === "hours" ? Style.activeButton : ""}`}
                        onClick={() => setCurrentView("hours")}
                    >
                        {text.ButtonLogHours}
                    </button>
                </div>

                {loading && <p className={Style.subtext}>{text.Loading}</p>}
                {errorMessage && <p className={Style.error}>{errorMessage}</p>}

                {currentView === "all" && (
                    <div className={Style.content}>
                        {hasFetchedAll && !loading && !errorMessage && employees.length === 0 && (
                            <div className={Style.helperCard}>
                                <p>{text.NoEmployeeFound}</p>
                            </div>
                        )}

                        {!loading && !errorMessage && employees.length > 0 && (
                            <div className={Style.grid}>
                                {employees.map((emp) => (
                                    <div className={Style.employeeCard} key={emp.id}>
                                        <div className={Style.employeeHeader}>
                                            <div>
                                                <div className={Style.employeeName}>{emp.name ?? "-"}</div>
                                                <div className={Style.employeeMeta}>
                                                    {text.Labels.Id}: <span className={Style.mono}>{emp.id}</span>
                                                </div>
                                            </div>

                                            <div className={Style.employeePill}>
                                                {text.Labels.HoursWorked}:{" "}
                                                <span className={Style.mono}>{emp.hours_worked ?? 0}</span>
                                            </div>
                                        </div>

                                        <div className={Style.employeeDivider} />

                                        <div className={Style.employeeRows}>
                                            <div className={Style.employeeRow}>
                                                <span className={Style.employeeKey}>{text.Labels.CurrentPay}</span>
                                                <span className={Style.employeeVal}>{rupiah(emp.current_pay)}</span>
                                            </div>

                                            <div className={Style.employeeRow}>
                                                <span className={Style.employeeKey}>{text.Labels.TotalPay}</span>
                                                <span className={Style.employeeVal}>{rupiah(emp.total_pay)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {currentView === "add" && (
                    <div className={Style.card}>
                        <p className={Style.subtext}>{text.AddTitle}</p>

                        <div className={Style.field}>
                            <label className={Style.label}>{text.Labels.Name}</label>
                            <input
                                className={Style.input}
                                placeholder={text.AddPlaceholder}
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                            />
                        </div>

                        <button
                            className={Style.primaryButton}
                            onClick={handleAddEmployee}
                            disabled={loading || employeeName.trim().length === 0}
                        >
                            {text.AddEmployeeButton}
                        </button>
                    </div>
                )}

                {currentView === "get" && (
                    <div className={Style.content}>
                        <div className={Style.card}>
                            <p className={Style.subtext}>{text.ButtonGetEmployee}</p>

                            <div className={Style.field}>
                                <label className={Style.label}>{text.Labels.Id}</label>
                                <input
                                    className={Style.input}
                                    placeholder={text.EnterId}
                                    value={employeeId}
                                    onChange={(e) => {
                                        setEmployeeId(e.target.value);
                                        setHasSearchedById(false);
                                        setFetchedEmployee(null);
                                        setErrorMessage("");
                                    }}
                                />
                            </div>

                            <button
                                className={Style.primaryButton}
                                onClick={handleGetEmployeeById}
                                disabled={loading || employeeId.trim().length === 0}
                            >
                                {text.GetButton}
                            </button>
                        </div>

                        {!loading && !errorMessage && fetchedEmployee && (
                            <div className={`${Style.employeeCard} ${Style.resultCard}`}>
                                <div className={Style.employeeHeader}>
                                    <div>
                                        <div className={Style.employeeName}>{fetchedEmployee.name ?? "-"}</div>
                                        <div className={Style.employeeMeta}>
                                            {text.Labels.Id}: <span className={Style.mono}>{fetchedEmployee.id}</span>
                                        </div>
                                    </div>

                                    <div className={Style.employeePill}>
                                        {text.Labels.HoursWorked}:{" "}
                                        <span className={Style.mono}>{fetchedEmployee.hours_worked ?? 0}</span>
                                    </div>
                                </div>

                                <div className={Style.employeeDivider} />

                                <div className={Style.employeeRows}>
                                    <div className={Style.employeeRow}>
                                        <span className={Style.employeeKey}>{text.Labels.CurrentPay}</span>
                                        <span className={Style.employeeVal}>{rupiah(fetchedEmployee.current_pay)}</span>
                                    </div>

                                    <div className={Style.employeeRow}>
                                        <span className={Style.employeeKey}>{text.Labels.TotalPay}</span>
                                        <span className={Style.employeeVal}>{rupiah(fetchedEmployee.total_pay)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!loading && !errorMessage && hasSearchedById && !fetchedEmployee && (
                            <div className={Style.helperCard}>
                                <p>{text.NotFound}</p>
                            </div>
                        )}
                    </div>
                )}

                {currentView === "remove" && (
                    <div className={Style.helperCard}>
                        <p>{message}</p>
                        <input onChange={(e) => { setEmployeeToRemoveId(e.target.value) }} placeholder={text.RemoveEmployeeInputPlaceholder}></input>
                        <button onClick={handleRemoveEmployeeById}>{text.RemoveEmployeeButton}</button>
                    </div>
                )}

                {currentView === "hours" && (
                    <div className={Style.helperCard}>
                        <input onChange={(e) => { setEmployeeHoursId(e.target.value) }} placeholder="Enter Employee Id"></input>

                        <input onChange={(e) => { setEmployeeHoursAmount(e.target.value) }} placeholder="Enter Worked Hours"></input>

                        <button>{text.ButtonLogHours}</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Employees;