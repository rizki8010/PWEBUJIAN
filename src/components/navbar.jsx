import logo from "../assets/gamer.png";
import { Link, NavLink } from "react-router-dom";
import { FaReact } from "react-icons/fa";

const Navbar = () => {
  const navigation = [
    { name: "Member", href: "/member" },
    { name: "Information", href: "/information" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-4 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3">
            <img
              className="h-12 w-12 rounded-full border-2 border-gray-700"
              src={logo}
              alt="Logo"
            />
            <span className="text-2xl font-bold text-gray-200 tracking-wide">
              Data Mahasiswa
            </span>
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <ul className="flex flex-grow justify-center space-x-8 text-lg font-medium -ml-40">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `relative text-lg ${
                    isActive ? "text-red-500" : "text-gray-300"
                  } hover:text-red-500 transition duration-300`
                }
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Button */}
        <div className="flex items-center space-x-4">
          <FaReact className="w-12 h-12 text-blue-500" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
