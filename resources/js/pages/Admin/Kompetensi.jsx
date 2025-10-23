import React, { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

const mockKompetensi = [
  {
    id: 1,
    title: "kompetensi 1",
    desc: "tidak ada deskripsi",
    bobot: 1,
    skorMaks: 4,
    status: "Belum disetting",
  },
  {
    id: 2,
    title: "Pake sarung tangan",
    desc: "Lorem ipsum dolor sit amet...",
    bobot: 1,
    skorMaks: 10,
    status: "Telah disetting",
  },
  {
    id: 3,
    title: "Menggunakan masker wajah",
    desc: "Lorem ipsum dolor sit amet...",
    bobot: 1,
    skorMaks: 5,
    status: "Telah disetting",
  },
  {
    id: 4,
    title: "Adu panco dengan penguji",
    desc: "Lorem ipsum dolor sit amet...",
    bobot: 1,
    skorMaks: 20,
    status: "Telah disetting",
  },
];

export default function Kompetensi() {
  const [data] = useState(mockKompetensi);

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <div className="mb-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Tambah Kompetensi
        </button>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Tuliskan Nama Rubrik"
          className="flex-1 px-4 py-2 border rounded-l-md text-sm"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md">
          Cari
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="border px-2 py-1">No</th>
            <th className="border px-2 py-1">Kompetensi</th>
            <th className="border px-2 py-1">Bobot</th>
            <th className="border px-2 py-1">Skor Maks</th>
            <th className="border px-2 py-1">Keterangan Skor</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={item.id}
              className={idx % 2 === 1 ? "bg-gray-100" : ""}
            >
              <td className="border px-2 py-1 align-top">{idx + 1}</td>
              <td className="border px-2 py-1">
                <div className="font-semibold leading-tight">{item.title}</div>
                <div className="text-xs text-gray-600">{item.desc}</div>
              </td>
              <td className="border px-2 py-1 text-center align-top">{item.bobot}</td>
              <td className="border px-2 py-1 text-center align-top">{item.skorMaks}</td>
              <td className="border px-2 py-1 text-center align-top">
                <span
                  className={`px-2 py-1 text-xs rounded-md font-medium ${
                    item.status === "Belum disetting"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-black border"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="border px-2 py-1 text-center align-top">
                <div className="flex justify-center gap-2">
                  <button className="p-1 rounded bg-gray-800 text-white hover:bg-gray-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 rounded bg-gray-800 text-white hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
