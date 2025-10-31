import React, { useEffect, useState } from "react";
// Import icons
import { Trash2, Home, Pencil, Search } from "lucide-react"; 
// PERHATIKAN INI: Kita import file form-nya
import AddAspekForm from "./AddAspekForm"; 

// Data mock (contoh)
const mockAspekData = [
    { id: 1, no: "A", nama: "Penilaian Pertama", jmlKompetensi: 5, bobot: 30 },
    { id: 2, no: "B", nama: "Penilaian Kedua", jmlKompetensi: 5, bobot: 30 },
    { id: 3, no: "C", nama: "Penilaian Ketiga", jmlKompetensi: 5, bobot: 30 },
];

// Ini adalah komponen UTAMA (Induk)
export default function Aspekpenilaian() { 
  const [aspekList, setAspekList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list', 'add', atau 'edit'
  const [aspekToEdit, setAspekToEdit] = useState(null);

  // --- SEMUA LOGIKA ADA DI SINI ---

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

  const handleDeleteClick = (itemId) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus aspek ini?")) {
      const updatedList = aspekList.filter((item) => item.id !== itemId);
      setAspekList(updatedList);
    }
  };

  // --- TAMPILAN BERDASARKAN VIEW ---

  // 1. Tampilan mode 'add'
  if (view === "add") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-8">
          <AddAspekForm 
            onBack={handleBackToList} 
            onSubmit={handleSubmitTambahAspek}
            mode="add"
          />
        </div>
      </div>
    );
  }

  // 2. Tampilan mode 'edit'
  if (view === "edit") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-8">
          <AddAspekForm 
            onBack={handleBackToList} 
            onSubmit={handleSubmitEditAspek}
            mode="edit"
            initialData={aspekToEdit}
          />
        </div>
      </div>
    );
  }

  // 3. Tampilan 'list' (default)
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8"> 
        
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-3 text-sm text-gray-700 mb-6 border border-gray-400 rounded-lg p-2 bg-white shadow-sm">
          <div className="bg-blue-600 text-white p-2 rounded-md flex items-center justify-center">
            <Home size={20} />
          </div>
          <span className="font-medium">Stase \ Stase Lorem Ipsum Dolor</span>
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

        {/* Search Bar (Ikon di dalam) */}
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
            {/* Header Tabel */}
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm font-medium border-b-2 border-gray-300">
                <th className="py-3 px-3 text-center w-[5%]">No</th>
                <th className="py-3 px-4 text-left w-[50%] border-l border-gray-300">Deskripsi</th>
                <th className="py-3 px-3 text-center w-[15%] border-l border-gray-300">Bobot maksimum</th>
                <th className="py-3 px-3 text-center w-[30%] border-l border-gray-300">Action</th>
              </tr>
            </thead>
            
            {/* Body Tabel */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : (
                aspekList.map((item, index) => (
                  <tr key={item.id} className="text-gray-800 text-sm"> 
                    <td className="py-3 px-3 text-center"> 
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border-l border-gray-300">
                      <div className="font-semibold">{item.no}. {item.nama}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.jmlKompetensi} Kompetensi</div>
                    </td>
                    <td className="py-3 px-3 text-center border-l border-gray-300">
                      {item.bobot}
                    </td>
                    <td className="py-3 px-3 text-center border-l border-gray-300">
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
                        <button 
                          onClick={() => handleDeleteClick(item.id)}
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
          </table>

          {/* Pagination */}
          <div className="flex justify-start items-center gap-4 text-sm p-4 border-t border-gray-200">
            <button className="w-8 h-8 rounded-full bg-gray-800 text-white font-semibold flex items-center justify-center hover:bg-gray-700">◄</button>
            <span className="text-gray-900 font-bold px-1">1</span>
            <span className="text-gray-600 px-1">2</span>
            <span className="text-gray-600 px-1">3</span>
            <span className="text-gray-600 px-1">4</span>
            <span className="text-gray-600 px-1">5</span>
            <button className="w-8 h-8 rounded-full bg-gray-800 text-white font-semibold flex items-center justify-center hover:bg-gray-700">►</button>
          </div>
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
          Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
        </div>
      </div>
    </div>
  );
};