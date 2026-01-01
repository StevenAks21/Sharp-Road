
import { useEffect } from "react";
function Main() {

  useEffect(() => {
    document.title = "SharpRoad Dashboard";
  })
  return (
    <div className="App">
      <p>Welcome to SharpRoad Dashboard, are you logging in from the SharpRoad building or outside of SharpRoad?</p>
      <p>Selamat datang di Dashboard SharpRoad, apakah anda masuk dari gedung SharpRoad atau dari luar Gedung? </p>
    </div>
  );
}

export default Main;
