import React from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { ArrowLeft, Download } from "lucide-react";

// --- Import Komponen Halaman ---
import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";
import StaseAssessmentView from "../../components/NilaiDetail"; // Komponen anak

//=================================================================
// --- KOMPONEN HALAMAN UTAMA ---
//=================================================================
export default function RekapDetailPage() {
    const { detailNilai, flash } = usePage().props;
    const { mahasiswa, osce, nilai_per_stase, nilai_total_osce } = detailNilai;

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title={`Nilai ${mahasiswa.nama} - ${osce.nama_osce}`} />
            <Sidebar />

            <main className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                {/* Breadcrumb dinamis */}
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <button
                        onClick={handleBack}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center shadow-sm"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium bg-white">
                        Rekap Nilai / {osce.nama_osce} / ... / {mahasiswa.nama}
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {/* ... (Notifikasi flash) ... */}

                    {/* Bagian Account dinamis */}
                    <div className="bg-white p-6 border border-black rounded-2xl shadow mb-6">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2 border-black">
                            Account
                        </h2>
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full mr-6 bg-gray-700 flex-shrink-0">
                                {/* Ganti dengan <img /> jika Anda punya path gambar */}
                            </div>
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
                            </div>
                        </div>
                    </div>

                    {/* Judul dan Tombol Download */}
                    <div className="flex justify-between items-center mb-4 mt-6 border-b pb-2 border-gray-500">
                        <h2 className="font-semibold text-lg">
                            Nilai OSCE: {osce.nama_osce}
                        </h2>
                        <button className="flex items-center bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700">
                            <Download className="w-4 h-4 mr-2" />
                            Download Hasil Nilai OSCE
                        </button>
                    </div>

                    {/* Total Nilai Keseluruhan */}
                    <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-8 flex justify-between items-center">
                        <span className="font-semibold text-blue-800">
                            Nilai Total OSCE
                        </span>
                        <span className="text-2xl font-bold text-blue-900">
                            {parseFloat(nilai_total_osce || 0).toFixed(2)}
                        </span>
                    </div>

                    {/* Looping data nilai dari controller */}
                    {nilai_per_stase.map((stase, index) => {
                        // [FIX] Transformasi data agar cocok dengan komponen NilaiDetail
                        // Komponen anak (NilaiDetail) mengharapkan array datar { item, value }
                        const assessmentData = [];

                        stase.aspek_penilaian.forEach((aspek) => {
                            // Tambahkan header aspek (ini tidak ada di mock, tapi ada di screenshot)
                            // Komponen NilaiDetail.jsx Anda tidak menangani "HEADER"
                            // jadi kita akan ikuti struktur mock data:

                            // assessmentData.push({
                            //     item: `Aspek: ${aspek.aspek}`,
                            //     value: "HEADER", // Tanda khusus (jika komponen anak bisa menanganinya)
                            // });

                            aspek.kompetensi.forEach((komp) => {
                                // Komponen anak mengharapkan format value "SKOR (Deskripsi)"
                                // Kita akan kirim format "SKOR (Bobot: X, Nilai: Y)"
                                assessmentData.push({
                                    item: komp.kompetensi, // Nama Kompetensi
                                    value: `${komp.nilai} (Bobot: ${komp.bobot} x Skor: ${komp.skor})`,
                                });
                            });
                        });

                        return (
                            <div
                                key={`${stase.nama_stase}-${index}`} // Key unik
                                className={
                                    index > 0
                                        ? "border-t border-gray-500 mt-8 pt-8"
                                        : ""
                                }
                            >
                                <StaseAssessmentView
                                    staseNumber={`Stase ${index + 1}`}
                                    staseName={stase.nama_stase}
                                    examinerName={stase.nama_penguji || "N/A"}
                                    overallScore={parseFloat(
                                        stase.nilai_akhir_stase || 0
                                    ).toFixed(0)} // Dibulatkan
                                    // [PERBAIKAN UTAMA] Kirim variabel 'assessmentData' yang sudah diratakan
                                    assessmentData={assessmentData}
                                />
                            </div>
                        );
                    })}
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}
