// import Styles from '../Style/Employees.module.css'
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
        ButtonLogHours: "Log Work Hours"

    },
    Indonesian: {
        PageTitle: "SharpRoad - Halaman Karyawan",
        ButtonAllEmployees: "Tampilkan Semua Karyawan",
        ButtonAddEmployee: "Tambah Karyawan",
        ButtonGetEmployee: "Tampilkan Karyawan Berdasarkan ID",
        ButtonRemoveEmployee: "Hapus Karyawan Berdasarkan ID",
        ButtonLogHours: "Catat Jam Kerja"
    }
}

function GetAllEmployees() {
    const data = GetAll();
    return (
        <div>
            <p>{data}p</p>
        </div>
    )
}

function Employees() {
    const [language] = useContext(languageContext);
    const text = TEXT[language ?? "English"];

    useEffect(() => {
        document.title = text.PageTitle;
    }, [text]);
    return (
        <div>
            <Navbar />
            <div className='Action-Buttons'>
                <button onClick = {GetAllEmployees}>{text.ButtonAllEmployees}</button>
                <button>{text.ButtonAddEmployee}</button>
                <button>{text.ButtonGetEmployee}</button>
                <button>{text.ButtonRemoveEmployee}</button>
                <button>{text.ButtonLogHours}</button>
            </div>
        </div>
    )
}

export default Employees;