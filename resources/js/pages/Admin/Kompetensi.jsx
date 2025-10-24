import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

export default function PenilaianPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const data = [
    {
      no: 1,
      kompetensi: 'Aspek Penilaian 1',
      bobot: 1,
      skorMaks: 4
    }
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${sidebarOpen ? 'w-20' : 'w-0'} overflow-hidden bg-gray-200 p-2 flex flex-col items-center`}>
        <button onClick={toggleSidebar} className="bg-blue-600 text-white p-2 rounded mb-4">
          ⬅
        </button>
        {sidebarOpen && (
          <nav className="space-y-4">
            <button className="text-xl">🏠</button>
            <button className="text-xl">👥</button>
            <button className="text-xl">📄</button>
            <button className="text-xl">⭐</button>
            <button className="text-xl">⚙️</button>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={toggleSidebar} className="bg-blue-600 text-white p-2 rounded">🔙</button>
          <span className="text-sm text-gray-600">Rubrik / Packet Rubrik 1 / <span className="font-bold text-black">Aspek Penilaian</span></span>
        </div>

        {/* Menu Info */}
        <h2 className="text-lg font-semibold">Menu Aspek Penilaian</h2>
        <p className="text-sm text-gray-500 mb-4">
          Halaman ini berisi aspek-aspek yang nanti dinilai oleh penguji. Setiap rubrik bisa memiliki berbagai macam aspek penilaian.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Tambah Aspek Penilaian
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Edit Skenario</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Edit Point Aspek Penilaian</button>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Tuliskan data aspek penilaian..."
            className="border px-3 py-2 rounded-md text-sm w-full md:w-96"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Cari</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-2 border">No</th>
                <th className="p-2 border text-left">Kompetensi</th>
                <th className="p-2 border">Bobot</th>
                <th className="p-2 border">Skor Maks</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="text-sm bg-white">
                  <td className="text-center border p-2">{item.no}</td>
                  <td className="border p-2 font-medium">{item.kompetensi}</td>
                  <td className="text-center border p-2">{item.bobot}</td>
                  <td className="text-center border p-2">{item.skorMaks}</td>
                  <td className="text-center border p-2">
                    <div className="flex gap-2 justify-center">
                      <button className="p-1 bg-blue-600 text-white rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 bg-black text-white rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 mt-6">
          Copyright Porem ipsum dolor sit amet | Porem ipsum dolor sit amet
        </footer>
      </main>
    </div>
  );
}
