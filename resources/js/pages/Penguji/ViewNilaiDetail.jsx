import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsHeader from "../../components/Header";
import OsCopyright from "../../components/copyright";

// --- Mock Data (Bisa diganti data dari DB) ---
const mockData = {
  mahasiswa: {
    nama: "Putri Levina Agatha",
    nim: "12345689012345",
    jurusan: "Kedokteran"
  },
  penilaian: [
    {
      kategori: "A. Persiapan",
      items: [
        { id: 1, aspek: "Verifikasi", skor: 4, bobot: 3, nilai: 12 },
        { id: 2, aspek: "Menyiapkan Alat", skor: 4, bobot: 3, nilai: 12 },
        { id: 3, aspek: "Cuci Tangan 6 Langkah", skor: 4, bobot: 3, nilai: 12 },
      ]
    },
    {
      kategori: "B. Orientasi",
      items: [
        { id: 1, aspek: "Verifikasi", skor: 4, bobot: 3, nilai: 12 },
      ]
    }
  ],
  totalNilai: 48,
  feedback: "Lorem ipsum dolor sit amet consectetur. Sapien porttitor urna nibh a urna. Sodales nam mollis iaculis diam viverra. Arcu a ligula morbi tristique suscipit amet. Nibh tincidunt eget aliquet vulputate tempus quisque magna.Lorem ipsum dolor sit amet consectetur. Sapien porttitor urna nibh a urna. Sodales nam mollis iaculis diam viverra. Arcu a ligula morbi tristique suscipit amet. Nibh tincidunt eget aliquet vulputate tempus quisque magna.Lorem ipsum dolor sit amet consectetur. Sapien porttitor urna nibh a urna. Sodales nam mollis iaculis diam viverra. Arcu a ligula morbi tristique suscipit amet. Nibh tincidunt eget aliquet vulputate tempus quisque magna."
};

// --- Komponen Internal: Lingkaran Skor (0-4) ---
const ScoreCircle = ({ value, selected }) => {
    return (
        <div className="flex flex-col items-center mx-1">
            <span className="text-xs font-medium text-gray-600 mb-1">{value}</span>
            <div 
                className={`w-5 h-5 rounded-full border border-black flex items-center justify-center
                    ${selected ? 'bg-black' : 'bg-white'}
                `}
            >
                {/* Jika selected, bisa dikasih titik putih atau biarkan solid hitam */}
                {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
        </div>
    );
};

export default function ViewNilaiDetail() {
  // Ambil data dari props
  const { data = mockData } = usePage().props;

  return (
    <div className="relative bg-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
      <Sidebar />

      <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
        
        {/* 1. Header */}
        <OsHeader 
          className="fixed" 
          title="OSCE / OSCE Radiologi 01-A / Detail OSCE/Detail Stase/ Penilaian Stase/Lihat Penilaian"
          icon={<ArrowLeft className="w-5 h-5" />}
        />

        <div className="flex-1 overflow-auto">
          
            {/* 2. Info Mahasiswa (Card dengan border hitam) */}
            <div className="flex items-center p-4 border border-black rounded-xl mb-6">
                <div className="w-16 h-16 bg-[#3C2F2F] rounded-full mr-6 flex-shrink-0"></div>
                <div className="flex flex-col space-y-1 text-sm">
                    <div><span className="font-bold">Nama :</span> {data.mahasiswa.nama}</div>
                    <div><span className="font-bold">NIM:</span> {data.mahasiswa.nim}</div>
                    <div><span className="font-bold">Jurusan :</span> {data.mahasiswa.jurusan}</div>
                </div>
            </div>

            {/* 3. Judul Penilaian */}
            <h2 className="text-xl text-black mb-4">Penilaian Stase</h2>

            {/* 4. Tabel Penilaian */}
            <div className="border border-black rounded-xl overflow-hidden mb-6">
                {/* Header Tabel */}
                <div className="flex border-b border-black bg-white text-sm font-medium">
                    <div className="w-16 p-3 text-center border-r border-black">No</div>
                    <div className="flex-1 p-3 border-r border-black">Aspek Penilaian</div>
                    <div className="w-64 p-3 text-center border-r border-black">Skor</div>
                    <div className="w-32 p-3 text-center border-r border-black">Bobot</div>
                    <div className="w-32 p-3 text-center">Nilai</div>
                </div>

                {/* Body Tabel (Looping Kategori) */}
                {data.penilaian.map((kategori, index) => (
                    <div key={index}>
                        {/* Judul Kategori (A. Persiapan, B. Orientasi) */}
                        <div className="p-3 font-bold text-sm bg-white border-b border-black">
                            {kategori.kategori}
                        </div>

                        {/* Looping Items per Kategori */}
                        {kategori.items.map((item) => (
                            <div key={item.id} className={`flex border-b border-black bg-${item.id % 2 === 0 ? 'gray-200' : 'white'}`}>
                                <div className="w-16 p-3 text-center border-r border-black flex items-center justify-center text-lg">{item.id}</div>
                                <div className="flex-1 p-3 border-r border-black flex items-center">{item.aspek}</div>
                                <div className="w-64 p-3 border-r border-black flex items-center justify-center">
                                    {/* Render 5 Lingkaran Skor (0-4) */}
                                    {[0, 1, 2, 3, 4].map((score) => (
                                        <ScoreCircle key={score} value={score} selected={item.skor === score} />
                                    ))}
                                </div>
                                <div className="w-32 p-3 border-r border-black flex items-center justify-center">{item.bobot}</div>
                                <div className="w-32 p-3 flex items-center justify-center font-bold">{item.nilai}</div>
                            </div>
                        ))}
                    </div>
                ))}

                {/* Footer Total Nilai */}
                <div className="flex bg-white font-bold">
                    <div className="flex-1 p-3 border-r border-black">Total nilai aspek penilaian</div>
                    <div className="w-32 p-3 text-center">{data.totalNilai}</div>
                </div>
            </div>

            {/* 5. Feedback */}
            <div className="mb-6">
                <h3 className="text-lg text-black mb-2">Feedback</h3>
                <div className="border border-black rounded-xl p-4 text-gray-600 text-sm leading-relaxed min-h-[150px]">
                    {data.feedback}
                </div>
            </div>

        </div>
        <OsCopyright />
      </main>
    </div>
  );
}