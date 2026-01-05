import Navbar from '../Components/Navbar'
import { useEffect, useState, useContext } from 'react';
import { FetchName } from '../Services/Home/FetchName';
import { languageContext } from '../Contexts';

const TEXT = {
    English: {
        Welcome: "Welcome Back, ",
    },
    Indonesian: {
        Welcome: "Selamat Datang Kembali, ",
    }
}

function Home() {
    const [user, setUser] = useState(null);
    const [language] = useContext(languageContext);
    const text = language ? TEXT[language] : null;

    const fetchUser = async () => {
        try {
            const userData = await FetchName();
            setUser(userData.username);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        document.title = "SharpRoad - Home Page";
        fetchUser();
    }, );

    return (
        <div>
            <Navbar />
            <h1>Home Page</h1>
            {user && <p>{text.Welcome} {user}</p>}
        </div>
    );
}

export default Home;