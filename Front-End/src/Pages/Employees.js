// import Styles from '../Style/Employees.module.css'
import Navbar from '../Components/Navbar'
import { useEffect, useContext } from 'react';
import { languageContext } from '../Contexts';

const TEXT = {
    English: {
        PageTitle: "SharpRoad - Employees Page"
    },
    Indonesian: {
        PageTitle: "SharpRoad - Halaman Karyawan"
    }
}

function Employees() {
    const [language] = useContext(languageContext);
    const text = TEXT[language ?? "English"];

    useEffect(() => {
        document.title = text.PageTitle;
    }, [text]);
    return (
        <Navbar />
    )
}

export default Employees;