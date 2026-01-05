// import Styles from '../Style/Employees.module.css'
import Navbar from '../Components/Navbar'
import { useEffect} from 'react';

function Employees() {


    useEffect(() => {
        document.title = "SharpRoad - Employees Page";
    }, []);
    return (
        <Navbar />
    )
}

export default Employees;