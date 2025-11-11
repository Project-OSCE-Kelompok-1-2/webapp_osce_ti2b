import React from "react";
import { usePage } from "@inertiajs/react";
import { ArrowLeft, Download } from "lucide-react";

// --- Import Komponen Halaman ---
import Sidebar from "../../components/Sidebar";
import OsBreadCrumb from "../../components/breadcrumb";
import OsCopyright from "../../components/copyright";
import StaseAssessmentView from "../../components/NilaiDetail";

//=================================================================
// --- DATA MOCK UNTUK HALAMAN ---
//=================================================================

const mockAccount = {
    nama: "Riko Aditya Zaki Sir Raja",
    nim: "12345689012345",
    jurusan: "Teknologi per-ilmuan hitam",
};

// --- Data stase adalah sebuah ARRAY ---
const mockAllStaseData = [
    {
        id: 1, // Tambahkan ID unik untuk 'key' React
        staseNumber: "Stase 1",
        staseName: "Stase Bedah Umum",
        examinerName: "Dr Mafkar Afkar",
        overallScore: "89",
        assessmentData: [
            {
                item: "Kompetensi membersihkannhdlpqhdqabjbdajkbqhuaofihnoqoanjdajvn",
                value: "3 (Sangat Baik)",
            },
            {
                item: "Kompetensi membersihkannhdlpqhdqabjbdajkbqhuaofihnoqoanjdajvn",
                value: "3 (Sangat Baik)",
            },
            {
                item: "Kompetensi membersihkannhdlpqhdqabjbdajkbqhuaofihnoqoanjdajvn",
                value: "4 (Sangat Baik)",
            },
        ],
    },
    {
        id: 2,
        staseNumber: "Stase 2",
        staseName: "Stase Anak",
        examinerName: "Dr. Pedri",
        overallScore: "92",
        assessmentData: [
            { item: "Anamnesis dengan orang tua", value: "4 (Sangat Baik)" },
            { item: "Pemeriksaan fisik anak", value: "4 (Sangat Baik)" },
        ],
    },
    {
        id: 3,
        staseNumber: "Stase 3",
        staseName: "Stase Jiwa",
        examinerName: "Dr. Gavi",
        overallScore: "75",
        assessmentData: [
            { item: "Wawancara psikiatri", value: "3 (Baik)" },
            { item: "Penilaian status mental", value: "2 (Cukup)" },
        ],
    },
];

//=================================================================
// --- KOMPONEN HALAMAN UTAMA ---
//=================================================================
export default function RekapDetailNilaiPage() {
    // --- [DIUBAH] Ambil 'allStase' (array) dari props ---
    // Di kode production, Anda akan menerima 'allStase' ini dari controller
    const {
        mahasiswa = mockAccount,
        allStase = mockAllStaseData, // <-- Gunakan array sebagai default
    } = usePage().props;

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                <OsBreadCrumb
                    className="fixed"
                    title="Rekap Nilai / Nilai Enviroment Mahasiswa / Riko Aditya Zaki Sir Raja / Detail Nilai"
                    icon={<ArrowLeft className="w-5 h-5" />}
                />

                <div className="flex-1 overflow-auto">
                    {/* --- BAGIAN ACCOUNT --- */}
                    <div className="bg-white p-6 border border-black rounded-2xl shadow mb-6">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2 border-black">
                            Account
                        </h2>
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full mr-6 bg-gray-700 flex-shrink-0"></div>
                            <div>
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">
                                        Nama :
                                    </span>{" "}
                                    {mahasiswa.nama}
                                </p>
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">NIM :</span>{" "}
                                    {mahasiswa.nim}
                                </p>
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">
                                        Jurusan :
                                    </span>{" "}
                                    {mahasiswa.jurusan}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- JUDUL DAN TOMBOL DOWNLOAD --- */}
                    <div className="flex justify-between items-center mb-4 mt-6 Nilai border-b pb-2 border-gray-500">
                        <h2 className="font-semibold text-lg">
                            Nilai (Nama Rubrik)
                        </h2>
                        <button className="flex items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700">
                            <Download className="w-4 h-4 mr-2" />
                            Download Hasil Nilai OSCE
                        </button>
                    </div>

                    {/* Ini akan otomatis scroll jika daftarnya panjang */}
                    {allStase.map((stase, index) => (
                        // 1. Tambahkan <div> pembungkus
                        <div
                            key={stase.id} // <-- Letak 'key' ke <div> pembungkus
                            // 2. Tambahkan kondisi ini:
                            className={
                                index > 0 // Cek: "Apakah ini BUKAN item pertama?"
                                    ? "border-t border-gray-500 mt-8 pt-8" // JIKA YA: tambahkan garis abu-abu, margin atas, padding atas
                                    : "" // JIKA TIDAK (item pertama): jangan tambahkan kelas apa-apa
                            }
                        >
                            <StaseAssessmentView
                                staseNumber={stase.staseNumber}
                                staseName={stase.staseName}
                                examinerName={stase.examinerName}
                                overallScore={stase.overallScore}
                                assessmentData={stase.assessmentData}
                            />
                        </div>
                    ))}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
