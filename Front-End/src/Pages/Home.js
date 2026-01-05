import Navbar from '../Components/Navbar'
import { useEffect, useState, useContext } from 'react';
import { FetchName } from '../Services/Home/FetchName';
import { languageContext, insideContext } from '../Contexts';

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
    const [language, setLanguage] = useContext(languageContext);
    const [insideBuilding, setInsideBuilding] = useContext(insideContext);
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
        console.log(language)
        fetchUser();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Home Page</h1>
            {user && <p>{text.Welcome}, {user}</p>}
        </div>
    );
}

export default Home;