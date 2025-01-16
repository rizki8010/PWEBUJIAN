// src/App.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar"; // Pastikan jalur impor benar

const App = () => {
  return (
    <div>
      <Navbar /> {/* Navbar akan selalu tampil */}
      <Outlet /> {/* Konten sesuai dengan rute */}
    </div>
  );
};

export default App;
