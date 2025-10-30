import React, { useEffect, useState } from "react";
// Import icons yang kita pakai di tabel
import { Trash2, Home, Pencil, Search } from "lucide-react"; 

// =====================================================================
// == KOMPONEN AddAspek (FORM TAMBAH / EDIT) ==
// Tidak ada perubahan di bagian ini.
// =====================================================================

function AddAspek({ onBack, onSubmit, mode, initialData }) {
  const [nama, setNama] = useState(initialData?.nama || ""); 
  const [bobot, setBobot] = useState(initialData?.bobot || "30");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nama: nama,
      bobot: parseInt(bobot) || 0,
    });
  };

  const isEditMode = mode === 'edit';
  const pageTitle = isEditMode ? 'Edit Aspek Kompetensi' : 'Tambah Aspek Kompetensi';
  const formTitle = isEditMode ? 'Form Edit Aspek Penilaian' : 'Form Tambah Aspek Penilaian';

  return (
    <div className="p-4 space-y-6">
      
      <div className="flex items-center gap-3 text-sm text-gray-700 mb-6 border rounded-lg p-2 bg-white shadow-sm">
        <button 
          onClick={onBack}
          className="bg-blue-600 text-white p-2 rounded-md flex items-center justify-center hover:bg-blue-700 transition"
          title="Kembali"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </button>
        <span className="font-medium">Stase \ Menu Aspek Penilaian\ {pageTitle}</span>
      </div>

      <div className="max-w-xl mx-auto border-2 rounded-lg shadow-xl overflow-hidden">
        
        <div className="bg-gray-800 text-white px-6 py-5 text-center">
          <h2 className="font-semibold text-xl">{formTitle}</h2>
          <p className="text-sm text-gray-300 mt-1">
            Dosen Penguji : Tahan Prahara., S.T., M.Kom
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 space-y-5">
          <div>
            <label htmlFor="nama-aspek" className="text-sm font-medium text-gray-700 block mb-2">
              Nama Aspek Penilaian
            </label>
            <textarea
              id="nama-aspek"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
              rows={5}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="bobot-maksimal" className="text-sm font-medium text-gray-700 block mb-2">
              Bobot Maksimal Aspek Penilaian
            </label>
            <input
              id="bobot-maksimal"
              type="number"
              value={bobot}
              onChange={(e) => setBobot(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-lg transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="text-center text-gray-400 text-sm mt-16 border-t pt-4">
          Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
      </div>
    </div>
  );
}


// =====================================================================
// == KOMPONEN UTAMA (Kompetensi) ==
// === PERUBAHAN DI SINI: Menambah logika untuk 'delete' ===
// =====================================================================

const mockAspekData = [
    { id: 1, no: "A", nama: "Penilaian Pertama", jmlKompetensi: 5, bobot: 30 },
    { id: 2, no: "B", nama: "Penilaian Kedua", jmlKompetensi: 5, bobot: 30 },
    { id: 3, no: "C", nama: "Penilaian Ketiga", jmlKompetensi: 5, bobot: 30 },
];

const Kompetensi = () => {
  const [aspekList, setAspekList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list");
  const [aspekToEdit, setAspekToEdit] = useState(null);

  const fetchAspek = async () => {
    try {
      await new Promise((r) => setTimeout(r, 500));
      setAspekList(mockAspekData);
    } catch (error) {
      console.error("Gagal mengambil data aspek:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAspek();
  }, []);

  const handleTambahKompetensi = () => {
    setAspekToEdit(null);
    setView("add");
  };

  const handleEditClick = (item) => {
    setAspekToEdit(item);
    setView("edit");
  };

  const handleBackToList = () => {
    setAspekToEdit(null);
    setView("list");
  };

  const handleSubmitTambahAspek = ({ nama, bobot }) => {
    const newData = {
      id: aspekList.length + 1,
      no: String.fromCharCode(65 + aspekList.length),
      nama: nama,
      jmlKompetensi: 0,
      bobot: bobot,
    };
    setAspekList([...aspekList, newData]);
    handleBackToList();
  };

  const handleSubmitEditAspek = ({ nama, bobot }) => {
    const updatedList = aspekList.map((item) => {
      if (item.id === aspekToEdit.id) {
        return { ...item, nama: nama, bobot: bobot };
      }
      return item;
    });
    setAspekList(updatedList);
    handleBackToList();
  };

  // === 1. FUNGSI BARU UNTUK HAPUS ===
  const handleDeleteClick = (itemId) => {
    // Tampilkan konfirmasi dulu
    if (window.confirm("Apakah kamu yakin ingin menghapus aspek ini?")) {
      // Filter list, buang item yang ID-nya cocok
      const updatedList = aspekList.filter((item) => item.id !== itemId);
      setAspekList(updatedList);
      // TODO: Nanti di sini kamu juga harus panggil API ke backend untuk hapus
    }
  };


  if (view === "add") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-8">
          <AddAspek 
            onBack={handleBackToList} 
            onSubmit={handleSubmitTambahAspek}
            mode="add"
          />
        </div>
      </div>
    );
  }

  if (view === "edit") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-8">
          <AddAspek 
            onBack={handleBackToList} 
            onSubmit={handleSubmitEditAspek}
            mode="edit"
            initialData={aspekToEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8"> 
        
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-3 text-sm text-gray-700 mb-6 border rounded-lg p-2 bg-white shadow-sm">
          <div className="bg-blue-600 text-white p-2 rounded-md flex items-center justify-center">
            <Home size={20} />
          </div>
          <span className="font-medium">Stase \ Menu Aspek Penilaian</span>
        </div>

        {/* Header Menu */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Menu Aspek Penilaian
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Halaman ini berfungsi untuk menambahkan penguji yang nanti menguji mahasiswa pada setiap stase
          </p>
        </div>

        {/* Tombol Tambah */}
        <div className="mb-4">
          <button
            onClick={handleTambahKompetensi}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-medium"
          >
            ＋ Tambah Aspek Penilaian
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full gap-3 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari data penguji..."
              className="w-full border-2 border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg shadow font-medium">
            Cari
          </button>
        </div>

        {/* Tabel Aspek Penilaian */}
        <div className="bg-white shadow rounded-lg overflow-x-auto border border-gray-200">
          <h3 className="px-4 py-3 border-b text-gray-700 font-semibold text-lg">
            Table Aspek Penilaian
          </h3>
          
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm font-medium">
                <th className="py-3 px-3 border-b text-center w-[5%]">No</th>
                <th className="py-3 px-4 border-b text-left w-[50%]">Deskripsi</th>
                <th className="py-3 px-3 border-b text-center w-[15%]">Bobot maksimum</th>
                <th className="py-3 px-3 border-b text-center w-[30%]">Action</th>
              </tr>
            </thead>
            
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : (
                aspekList.map((item, index) => (
                  <tr key={item.id} className="text-gray-800 text-sm hover:bg-gray-50">
                    <td className="py-3 px-3 border-b border-gray-200 text-center border-r border-gray-300">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      <div className="font-semibold">{item.no}. {item.nama}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.jmlKompetensi} Kompetensi</div>
                    </td>
                    <td className="py-3 px-3 border-b border-gray-200 text-center border-l border-r border-gray-300">
                      {item.bobot}
                    </td>
                    <td className="py-3 px-3 border-b border-gray-200 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                          Edit Kompetensi
                        </button>
                        
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
                          title="Edit Aspek"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* === 2. TOMBOL HAPUS DIPASANG FUNGSI === */}
                        <button 
                          onClick={() => handleDeleteClick(item.id)} // <-- DIPASANG DI SINI
                          className="p-2 bg-white text-black border border-black rounded-lg hover:bg-gray-100" 
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Pagination */}
            <tfoot className="font-semibold">
                <tr>
                  <td colSpan="2" className="py-3 px-4 text-left border-b border-gray-200">
                        <div className="flex justify-start items-center gap-4 text-sm">
                            <button className="w-8 h-8 rounded-md bg-blue-600 text-white font-semibold flex items-center justify-center hover:bg-blue-700">◄</button>
                            <button className="w-8 h-8 rounded-md bg-blue-600 text-white font-semibold">1</button>
                            <span className="text-gray-600 px-1">2</span>
                            <span className="text-gray-600 px-1">3</span>
                            <span className="text-gray-600 px-1">4</span>
                            <span className="text-gray-600 px-1">5</span>
                            <button className="w-8 h-8 rounded-md bg-gray-100 text-gray-600 font-semibold flex items-center justify-center hover:bg-gray-200">►</button>
                        </div>
                    </td>
                  <td colSpan="2" className="border-b border-gray-200"></td>
                </tr>
            </tfoot>
          </table>
        </div>

        {/* Baris Total (Tabel Terpisah) */}
        <div className="bg-white shadow rounded-lg overflow-x-auto mt-6">
            <table className="w-full min-w-max">
                <tfoot className="font-semibold">
                    <tr>
                        <td className="py-3 px-4 text-center text-base w-[55%]">Total</td> 
                        <td className="py-3 px-3 border-l border-gray-300 text-center text-base w-[15%]">90</td> 
                        <td className="py-3 px-3 border-l border-gray-300 text-center w-[30%]">
                        <button className="bg-red-600 text-white text-sm px-3 py-2 rounded-lg shadow-md">
                            Point Tidak Seimbang!
                        </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>


        {/* Footer Copyright */}
        <div className="text-center text-gray-400 text-sm mt-16 border-t pt-4">
          MOSAIC | Website Osce Politeknik Negeri Semarang
        </div>
      </div>
    </div>
  );
};

export default Kompetensi;