import Navbar from '../Components/Navbar'
import { useEffect, useState, useContext } from 'react';
import { FetchName } from '../Services/Home/FetchName';
import { languageContext, insideContext } from '../Contexts';

function Home() {
    const [user, setUser] = useState(null);
    const { language, setLanguage } = useContext(languageContext);
    const { insideBuilding, setInsideBuilding } = useContext(insideContext);

    const fetchUser = async () => {
        try {
            const userData = await FetchName();
            console.log(userData.username);
            setUser(userData.username);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        document.title = "SharpRoad - Home Page";

        fetchUser();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Home Page</h1>
            {user && <p>Welcome Back, {user}</p>}
        </div>
    );
}

export default Home;