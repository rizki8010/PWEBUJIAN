import fajar from "../assets/fajar.jpg"; // Gambar pertama
import ilham from "../assets/ilham1.jpg"; // Gambar kedua
import nana from "../assets/nana.jpg"; // Gambar ketiga
import { FaReact, FaDatabase } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { FaGolang } from "react-icons/fa6";
import BackgroundAnimation from "../components/backgroundanimation";

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6 overflow-hidden">
      {/* Background Animation */}
      <BackgroundAnimation className="absolute inset-0 z-0" />

      {/* Section untuk Cards */}
      <div className="relative flex gap-6 mb-8">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden w-60 hover:scale-105 transition-transform duration-300">
          <img src={fajar} alt="fajar" className="w-60 h-96 object-cover" />
          <p className="text-center font-semibold py-2">Nur Fajar Apriyanyo</p>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden w-60 hover:scale-105 transition-transform duration-300">
          <img src={ilham} alt="Ilham" className="w-60 h-96 object-cover" />
          <p className="text-center font-semibold py-2">
            Rizki Ilhamnuddin Muria
          </p>
          <p className="text-center font-semibold py-2">51422467</p>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden w-60 hover:scale-105 transition-transform duration-300">
          <img src={nana} alt="Nana" className="w-60 h-96 object-cover" />
          <p className="text-center font-semibold py-2">Natasha Rahima</p>
          <p className="text-center font-semibold py-2">51422212</p>
        </div>
      </div>

      {/* Section untuk Ikon */}
      <div className="relative flex gap-10 mt-8">
        <div className="flex flex-col items-center group">
          <SiTailwindcss className="text-cyan-500 text-9xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <div className="flex flex-col items-center group">
          <FaReact className="text-blue-500 text-9xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <div className="flex flex-col items-center group">
          <FaGolang className="text-teal-400 text-9xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <div className="flex flex-col items-center group">
          <FaDatabase className="text-yellow-500 text-9xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};

export default Home;
