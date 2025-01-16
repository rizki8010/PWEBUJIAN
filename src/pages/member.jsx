import { useState, useEffect } from "react";
import KtmCard from "../components/KtmCard";
import html2canvas from "html2canvas";
import deleteIcon from "../assets/delete.svg";
import viewIcon from "../assets/view.svg";
import downloadIcon from "../assets/download.svg";
import editIcon from "../assets/edit.svg";

function App() {
  const facultyMajorsMap = {
    KEDOKTERAN: ["S1 - KEDOKTERAN", "PENDIDIKAN PROFESI DOKTER"],
    "ILMU KOMPUTER DAN TEKNOLOGI INFORMASI": [
      "S1 - TEKNIK ELEKTRO",
      "S1 - SISTEM KOMPUTER",
      "S1 - SISTEM INFORMASI",
    ],
    "KESEHATAN DAN FARMASI": [
      "S1 - KEBIDANAN",
      "S1 - FARMASI",
      "PENDIDIKAN PROFESI BIDAN",
    ],
    "TEKNIK SIPIL DAN PERENCANAAN": [
      "S1 - TEKNIK SIPIL",
      "S1 - DESAIN INTERIOR",
      "S1 - ARSITEKTUR",
    ],
    EKONOMI: ["S1 - MANAJEMEN", "S1 - EKONOMI SYARIAH", "S1 - AKUTANSI"],
    PSIKOLOGI: ["S1 - PSIKOLOGI", "PENDIDIKAN PROFESI PSIKOLOGI"],
    "TEKNOLOGI INDUSTRI": [
      "S1 - TEKNIK MESIN",
      "S1 - TEKNIK INFORMATIKA",
      "S1 - TEKNIK INDUSTRI",
      "S1 - TEKNIK ELEKTRO",
      "S1 - INFORMATIKA",
      "S1 - AGROTEKNOLOGI",
    ],
    "SASTRA DAN BUDAYA": [
      "S1 - SASTRA TIONGKOK",
      "S1 - SASTRA INGGRIS",
      "S1 - PARIWISATA",
    ],
    "ILMU KOMUNIKASI": ["S1 - ILMU KOMUNIKASI"],
  };

  const [students, setStudents] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    major: "",
    faculty: "",
    photo: null, // Add photo field
  });
  const [photoPreview, setPhotoPreview] = useState(null); // Add photo preview state
  const [editId, setEditId] = useState(null);
  const [availableMajors, setAvailableMajors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Update API URL to point to Go backend
  const API_URL = "http://localhost:8080/students";

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStudents(data || []); // Ensure we set an empty array if data is null
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.faculty) {
      setAvailableMajors(facultyMajorsMap[formData.faculty]);
      if (!facultyMajorsMap[formData.faculty]?.includes(formData.major)) {
        setFormData((prev) => ({ ...prev, major: "" }));
      }
    } else {
      setAvailableMajors([]);
    }
  }, [formData.faculty]);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          photo: file,
        });
        // Create preview URL
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.nim ||
      !formData.name ||
      !formData.major ||
      !formData.faculty
    ) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const formDataToSend = new FormData();
      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      }
      formDataToSend.append("nim", formData.nim);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("faculty", formData.faculty);
      formDataToSend.append("major", formData.major);

      // Update URL construction for PUT requests
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      await fetchStudents(); // Refresh the list after update

      // Reset form and preview
      setFormData({
        nim: "",
        name: "",
        major: "",
        faculty: "",
        photo: null,
        photo_url: null,
      });
      setPhotoPreview(null);
      setEditId(null);
      alert(editId ? "Data berhasil diupdate!" : "Data berhasil ditambahkan!");
    } catch (error) {
      console.error("Error saving student:", error);
      alert(
        `Gagal ${editId ? "mengupdate" : "menambahkan"} data: ${error.message}`
      );
    }
  };

  const deleteStudent = async (id) => {
    try {
      // Add confirmation dialog
      if (!window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
        return;
      }

      // Update the URL to match the backend route
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete student");
      }

      await fetchStudents();
      alert("Data berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Gagal menghapus data: " + error.message);
    }
  };

  const startEdit = (student) => {
    setEditId(student.id);
    setFormData({
      nim: student.nim,
      name: student.name,
      major: student.major,
      faculty: student.faculty,
      photo: null, // Reset photo to prevent issues with file input
    });
    setPhotoPreview(getImageUrl(student.photo_url));

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({
      nim: "",
      name: "",
      major: "",
      faculty: "",
      photo: null,
    });
    setPhotoPreview(null);
  };

  const sortedFaculties = Object.keys(facultyMajorsMap).sort();

  // Update image src to use full URL
  const getImageUrl = (path) => {
    if (!path) return "";
    // Remove any double slashes and ensure the path starts with a single slash
    const cleanPath = path.replace(/\/+/g, "/");
    return `http://localhost:8080${cleanPath}`;
  };

  const downloadKtm = async (student) => {
    setSelectedStudent(student);

    // Wait for the card to be rendered
    setTimeout(async () => {
      try {
        const element = document.getElementById("ktm-card");
        const canvas = await html2canvas(element, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });

        const link = document.createElement("a");
        link.download = `KTM_${student.name.replace(/\s+/g, "_")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Error downloading KTM:", error);
        alert("Failed to download KTM");
      } finally {
        setSelectedStudent(null);
      }
    }, 100);
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.nim.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-700 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-4xl font-extrabold text-white text-center">
              KARTU TANDA MAHASISWA
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 bg-slate-700 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Foto
                </label>
                <div className="flex flex-col items-center space-y-3 p-4 bg-slate-900 rounded-lg border-2 border-dashed border-gray-300">
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg shadow-md"
                    />
                  )}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-500 bg-slate-800
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-900 file:text-blue-50
                      hover:file:bg-blue-100 transition-all
                      hover:file:text-red-700"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block  text-sm font-semibold text-gray-100">
                    NPM
                  </label>
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleChange}
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors bg-slate-700"
                    placeholder="Masukkan NPM"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-100">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors bg-slate-700"
                    placeholder="Masukkan Nama"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-100">
                    Fakultas
                  </label>
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors bg-slate-700"
                  >
                    <option value="">Pilih Fakultas</option>
                    {sortedFaculties.map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-100">
                    Jurusan
                  </label>
                  <select
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    disabled={!formData.faculty}
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors bg-slate-700"
                  >
                    <option value="">Pilih Jurusan</option>
                    {availableMajors.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
              >
                {editId !== null ? "Update Data" : "Tambah Data"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          <div className="p-8">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan Nama atau NPM..."
                  className="w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-colors pl-10"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border shadow-sm">
              <table className="w-full text-sm text-gray-500">
                <thead className="text-xs text-gray-200 uppercase bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Foto</th>
                    <th className="px-6 py-4 font-semibold">NPM</th>
                    <th className="px-6 py-4 font-semibold">Nama</th>
                    <th className="px-6 py-4 font-semibold">Jurusan</th>
                    <th className="px-6 py-4 font-semibold">Fakultas</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        {students.length === 0
                          ? "No students found"
                          : "No matching results"}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="bg-slate-600 border-b hover:bg-gray-500 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <img
                            src={getImageUrl(student.photo_url)}
                            alt={student.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-200">
                          {student.nim}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-200">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                          {student.major}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                          {student.faculty}
                        </td>
                        <td className="px-2 py-4">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors duration-200"
                              title="View"
                            >
                              <img
                                src={viewIcon}
                                alt="View"
                                className="w-5 h-5"
                                style={{
                                  filter:
                                    "invert(22%) sepia(90%) saturate(1000%) hue-rotate(142deg) brightness(94%) contrast(101%)",
                                }}
                              />
                            </button>
                            <button
                              onClick={() => downloadKtm(student)}
                              className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors duration-200"
                              title="Download"
                            >
                              <img
                                src={downloadIcon}
                                alt="Download"
                                className="w-5 h-5"
                                style={{
                                  filter:
                                    "invert(35%) sepia(54%) saturate(794%) hue-rotate(2deg) brightness(92%) contrast(95%)",
                                }}
                              />
                            </button>
                            <button
                              onClick={() => startEdit(student)}
                              className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                              title="Edit"
                            >
                              <img
                                src={editIcon}
                                alt="Edit"
                                className="w-5 h-5"
                                style={{
                                  filter:
                                    "invert(24%) sepia(70%) saturate(1391%) hue-rotate(204deg) brightness(96%) contrast(96%)",
                                }}
                              />
                            </button>
                            <button
                              onClick={() => deleteStudent(student.id)}
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                              title="Hapus"
                            >
                              <img
                                src={deleteIcon}
                                alt="Delete"
                                className="w-5 h-5"
                                style={{
                                  filter:
                                    "invert(27%) sepia(86%) saturate(2057%) hue-rotate(332deg) brightness(83%) contrast(97%)",
                                }}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {selectedStudent && (
        <KtmCard
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}

export default App;
