import React from "react";
import { usePage, Head } from "@inertiajs/react";
import { ArrowLeft, Download } from "lucide-react";

// --- Import Komponen ---
import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";
// 👇 Import komponen detail nilai yang sudah kamu buat
import StaseAssessmentView from "../../components/NilaiDetail";
import OsHeader from "../../components/Header";

export default function RekapDetailPage() {
    // Ambil data dari props controller
    const { detailNilai } = usePage().props;
    // Destructure data biar kodingnya lebih bersih
    const { mahasiswa, osce, nilai_per_stase, nilai_total_osce } = detailNilai;

    const handleBack = () => {
        window.history.back();
    };

        const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title={`Nilai ${mahasiswa.nama} - ${osce.nama_osce}`} />
            <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* --- Breadcrumb --- */}
                <OsHeader
                    variant="goback"
                    backLink=""
                />

                <div className="flex-1 overflow-auto">
                    {/* --- Info Mahasiswa (Account Card) --- */}
                    <div className="bg-white p-6 border border-black rounded-2xl  mb-6 mt-6">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2 border-black">
                            Account
                        </h2>
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full mr-6 bg-gray-200 flex items-center justify-center flex-shrink-0 border border-gray-400">
                                {/* Placeholder User Icon jika tidak ada gambar */}
                                <span className="text-2xl font-bold text-gray-500">
                                    {mahasiswa.nama.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800 mb-1">
                                    <span className="font-semibold w-16 inline-block">
                                        Nama
                                    </span>
                                    : {mahasiswa.nama}
                                </p>
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold w-16 inline-block">
                                        NIM
                                    </span>
                                    : {mahasiswa.nim}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- Header Judul & Download --- */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 border-gray-400 gap-4">
                        <h2 className="font-semibold text-xl text-gray-900">
                            Nilai OSCE: {osce.nama_osce}
                        </h2>
                        <button className="flex items-center bg-blue-600 text-white text-sm py-2.5 px-5 rounded-lg hover:bg-blue-700  transition-all">
                            <Download className="w-4 h-4 mr-2" />
                            Download Hasil
                        </button>
                    </div>

                    {/* --- Total Nilai Keseluruhan --- */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10 flex justify-between items-center ">
                        <span className="font-semibold text-blue-800 text-lg">
                            Nilai Total OSCE
                        </span>
                        <span className="text-3xl font-extrabold text-blue-900">
                            {parseFloat(nilai_total_osce || 0).toFixed(2)}
                        </span>
                    </div>

                    {/* --- LOOPING STASE (Disini komponen kamu dipasang) --- */}
                    {nilai_per_stase.map((stase, index) => {
                        // 1. Siapkan wadah array data
                        const assessmentData = [];

                        // 2. Ratakan data (Flatten) dari Aspek -> Kompetensi
                        // agar sesuai dengan format yang diminta komponen 'StaseAssessmentView'
                        stase.aspek_penilaian.forEach((aspek) => {
                            // Opsional: Jika ingin menampilkan Nama Aspek sebagai baris header di tabel
                            // assessmentData.push({
                            //     item: aspek.aspek,
                            //     value: "HEADER_ASPEK" // Nanti di handle di komponen anak jika perlu
                            // });

                            aspek.kompetensi.forEach((komp) => {
                                // HITUNG SKOR AMAN: Hindari null/undefined
                                const nilaiAman = komp.nilai || 0;
                                const bobotAman = komp.bobot || 0;
                                const skorAman = komp.skor || 0;

                                // Format string ini PENTING karena di komponen kamu ada logic:
                                // row.value.split(" ")[0]
                                // Jadi angka nilai harus ditaruh paling depan.
                                assessmentData.push({
                                    item: komp.kompetensi,
                                    value: `${nilaiAman} (Bobot: ${bobotAman} x Skor: ${skorAman})`,
                                });
                            });
                        });

                        return (
                            <div
                                key={`${stase.id_stase}-${index}`}
                                className={index > 0 ? "mt-12 border-t border-gray-300 pt-8" : ""}
                            >
                                {/* 👇 Memanggil Komponen NilaiDetail.jsx */}
                                <StaseAssessmentView
                                    staseNumber={`Stase ${index + 1}`}
                                    staseName={stase.nama_stase}
                                    examinerName={stase.nama_penguji} // Nama penguji dari backend
                                    overallScore={parseFloat(stase.nilai_akhir_stase || 0).toFixed(0)} // Nilai Bulat Stase
                                    assessmentData={assessmentData} // Data array yang sudah diformat
                                />
                            </div>
                        );
                    })}

                    {/* Pesan jika belum ada nilai stase */}
                    {nilai_per_stase.length === 0 && (
                        <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
                            Belum ada data penilaian untuk mahasiswa ini.
                        </div>
                    )}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
