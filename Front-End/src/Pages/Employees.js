import Navbar from '../Components/Navbar'
import { useState, useEffect, useContext } from 'react';
import { languageContext } from '../Contexts';
import { GetAll } from '../Services/Employees/GetAll';

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
        FailedToLoad: "Failed to load employees"
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
        FailedToLoad: "Gagal memuat karyawan"
    }
}

function Employees() {
    const [language] = useContext(languageContext);
    const text = TEXT[language ?? "English"];

    const [currentView, setCurrentView] = useState(null); // "all" | "add" | "get" | "remove" | "hours"
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        document.title = text.PageTitle;
    }, [text]);

    const handleGetAllEmployees = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const data = await GetAll(); // expects array
            setEmployees(Array.isArray(data) ? data : []);
            setCurrentView("all");
        } catch (err) {
            setEmployees([]);
            setErrorMessage(text.FailedToLoad);
            setCurrentView("all");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='Action-Buttons'>
                <button onClick={handleGetAllEmployees}>{text.ButtonAllEmployees}</button>
                <button onClick={() => setCurrentView("add")}>{text.ButtonAddEmployee}</button>
                <button onClick={() => setCurrentView("get")}>{text.ButtonGetEmployee}</button>
                <button onClick={() => setCurrentView("remove")}>{text.ButtonRemoveEmployee}</button>
                <button onClick={() => setCurrentView("hours")}>{text.ButtonLogHours}</button>
            </div>

            {currentView === "all" && (
                <div>
                    {loading && <p>{text.Loading}</p>}
                    {errorMessage && <p>{errorMessage}</p>}

                    {!loading && !errorMessage && employees.length === 0 && (
                        <p>{text.NoEmployeeFound}</p>
                    )}

                    {!loading && !errorMessage && employees.length > 0 && (
                        <ul>
                            {employees.map((emp) => (
                                <li key={emp.id}>
                                    {JSON.stringify(emp)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {currentView === "add" && (
                <div>
                    <p>Add Employee Page</p>
                </div>
            )}

            {currentView === "get" && (
                <div>
                    <p>Get Employee By ID Page</p>
                </div>
            )}

            {currentView === "remove" && (
                <div>
                    <p>Remove Employee By ID Page</p>
                </div>
            )}

            {currentView === "hours" && (
                <div>
                    <p>Log Work Hours Page</p>
                </div>
            )}
        </div>
    )
}

export default Employees;