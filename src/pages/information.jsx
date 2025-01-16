import BackgroundAnimation from "../components/backgroundanimation";
function Information() {
  return (
    <div className=" flex flex-col items-center p-8 mt-10 min-h-screen">
      <BackgroundAnimation className="container absolute inset-0 z-0" />
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Selamat Datang di Sistem Pendataan dan Pencetakan KTM
        </h1>
        <p className="text-lg  mb-8">
          Website ini dirancang untuk mempermudah pendataan mahasiswa dan
          mencetak Kartu Tanda Mahasiswa (KTM) secara efisien. Dengan integrasi
          backend Golang, frontend React, dan database MySQL, kami menyediakan
          solusi cepat dan andal untuk pengelolaan data mahasiswa.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-950 shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">
              Pendataan Mahasiswa
            </h2>
            <p className="text-white font-light">
              Sistem ini memungkinkan pengelolaan data mahasiswa secara
              terstruktur, mencakup informasi seperti nama, NPM, jurusan,
              strata, dan fakultas.
            </p>
          </div>
          <div className="bg-blue-950 shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">
              Pencetakan KTM
            </h2>
            <p className="text-white font-light">
              KTM dapat dicetak dengan desain profesional dan data yang
              terintegrasi langsung dari database.
            </p>
          </div>
          <div className="bg-blue-950 shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">
              Teknologi Modern
            </h2>
            <p className="text-white font-light">
              Menggunakan teknologi terbaru seperti React untuk antarmuka
              pengguna, Golang untuk backend, dan MySQL untuk manajemen
              database.
            </p>
          </div>
          <div className="bg-blue-950 shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">
              Proses Mudah dan Cepat
            </h2>
            <p className="text-white font-light">
              Dengan antarmuka yang ramah pengguna dan sistem yang dioptimalkan,
              proses pendataan dan pencetakan menjadi lebih mudah dan cepat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Information;
