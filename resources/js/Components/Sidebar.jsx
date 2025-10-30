import React, { useState } from "react";
import {
  Home,
  Users,
  UserCheck,
  FileText,
  Bookmark,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// 1. Saya ambil menu dari file Box.jsx Anda
const menuItems = [
  { label: "Beranda", icon: <Home size={24} /> },
  { label: "Mahasiswa", icon: <Users size={24} /> },
  { label: "Dosen", icon: <UserCheck size={24} /> },
  { label: "Rubrik", icon: <FileText size={24} /> },
  { label: "OSCE", icon: <FileText size={24} /> },
  { label: "Rekap Nilai Mahasiswa", icon: <Bookmark size={24} /> },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Dimulai dari 'terbuka'

  return (
    // 2. Ini adalah 'aside' dari Sidebar.jsx kita sebelumnya,
    //    menggunakan 'w-64' (terbuka) dan 'w-20' (tertutup)
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white text-gray-900 h-screen flex flex-col justify-between transition-all duration-300 relative border-r border-gray-900`}
    >
      {/* Tombol Toggle (menggunakan desain dari foto Anda) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-4 top-9 z-10 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition focus:outline-none"
      >
        {isOpen ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
      </button>

      {/* Bagian atas: Profil */}
      <div>
        {/* 3. Header Profil disesuaikan dengan foto Anda */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-900 h-[100px]">
          {/* Foto Profil */}
          <div className="w-12 h-12 rounded-full bg-gray-600 flex-shrink-0"></div>
          {/* Teks Profil (hanya tampil saat 'isOpen') */}
          {isOpen && (
            <div className="overflow-hidden">
              <p className="font-semibold text-black truncate">Admin1234</p>
              <p className="text-sm text-gray-500 truncate">Admin1234@gmail.com</p>
            </div>
          )}
        </div>

        {/* Menu Navigasi */}
        <nav className="flex flex-col gap-2 mt-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors ${!isOpen ? "justify-center" : "px-5"}`} // <-- Menengahkan ikon
            >
              <div className="flex-shrink-0 w-6 h-6">{item.icon}</div>
              {isOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Bagian bawah: Pengaturan */}
      <div className="border-t border-gray-900 p-4">
        <button className={`flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors w-full ${!isOpen ? "justify-center" : "px-5"}`}>
          <div className="flex-shrink-0 w-6 h-6"><Settings size={24} /></div>
          {isOpen && <span className="whitespace-nowrap">Pengaturan</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

