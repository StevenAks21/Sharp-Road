import Navbar from "../Components/Navbar";
import { useState, useEffect, useContext } from "react";
import { languageContext } from "../Contexts";
import { GetAll } from "../Services/Employees/GetAll";
import { AddEmployee } from "../Services/Employees/AddEmployee";
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
        AllTitle: "Daftar Karyawan",
        Labels: {
            Id: "ID",
            Name: "Nama",
            HoursWorked: "Jam Kerja",
            CurrentPay: "Gaji Saat Ini",
            TotalPay: "Total Gaji",
        },
    },
};

function Employees() {
    const [language] = useContext(languageContext);
    const text = TEXT[language ?? "English"];

    const [currentView, setCurrentView] = useState("all"); // "all" | "add" | "get" | "remove" | "hours"
    const [employees, setEmployees] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [hasFetchedAll, setHasFetchedAll] = useState(false);

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
                        onClick={() => setCurrentView("add")}
                    >
                        {text.ButtonAddEmployee}
                    </button>

                    <button
                        className={`${Style.button} ${currentView === "get" ? Style.activeButton : ""}`}
                        onClick={() => setCurrentView("get")}
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
                    <div className={Style.helperCard}>
                        <p>Get Employee By ID Page</p>
                    </div>
                )}

                {currentView === "remove" && (
                    <div className={Style.helperCard}>
                        <p>Remove Employee By ID Page</p>
                    </div>
                )}

                {currentView === "hours" && (
                    <div className={Style.helperCard}>
                        <p>Log Work Hours Page</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Employees;