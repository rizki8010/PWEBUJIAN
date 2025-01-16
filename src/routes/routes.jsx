// src/routes/routes.jsx
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home"; // Pastikan jalur impor benar
import Member from "../pages/member";
import App from "../App"; // Pastikan jalur impor benar
import InformationPage from "../pages/information";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/member",
        element: <Member />,
      },
      {
        path: "/information",
        element: <InformationPage />,
      },
      // Tambahkan rute lain di sini jika diperlukan
    ],
  },
]);

export default router;
