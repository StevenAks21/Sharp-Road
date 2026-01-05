import Navbar from '../Components/Navbar'
import { useEffect, useState, useContext } from 'react';
import { FetchName } from '../Services/Home/FetchName';
import { languageContext } from '../Contexts';

const TEXT = {
    English: {
        Welcome: "Welcome Back, ",
        PageTitle: "SharpRoad - Home Page"
    },
    Indonesian: {
        Welcome: "Selamat Datang Kembali, ",
        PageTitle: "SharpRoad - Halaman Beranda"
    }
}

function Home() {
    const [user, setUser] = useState(null);
    const [language] = useContext(languageContext);
    const text = TEXT[language ?? "English"];

    const fetchUser = async () => {
        try {
            const userData = await FetchName();
            setUser(userData.username);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        document.title = text.PageTitle;
        fetchUser();
    }, [text]);

    return (
        <div>
            <Navbar />
            <h1>Home Page</h1>
            {user && <p>{text.Welcome} {user}</p>}
        </div>
    );
}

export default Home;