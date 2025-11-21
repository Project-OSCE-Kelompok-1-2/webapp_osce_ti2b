import React, { useState, useEffect } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    User,
    FileText,
    AlertCircle,
    CheckCircle,
    Info
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import OsCopyright from "../../components/Copyright";

export default function EditNilaiPage({ rubrik_data }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash } = usePage().props;

    // 1. Persiapkan Initial State untuk useForm
    // Kita perlu meratakan (flatten) struktur rubrik yang bersarang
    // menjadi array 1 dimensi 'items' agar sesuai dengan validasi controller update()
    const getInitialItems = () => {
        let items = [];
        if (rubrik_data && rubrik_data.penilaian) {
            rubrik_data.penilaian.forEach((aspek) => {
                aspek.kompetensi_list.forEach((poin) => {
                    items.push({
                        id_poin_aspek_penilaian: poin.id_poin_aspek_penilaian,
                        nilai: poin.nilai_input !== null ? poin.nilai_input : 0,
                    });
                });
            });
        }
        return items;
    };

    const { data, setData, put, processing, errors, wasSuccessful } = useForm({
        items: getInitialItems(),
    });

    // 2. Handle perubahan nilai
    const handleScoreChange = (id_poin, newValue, maxScore) => {
        const val = parseFloat(newValue);
        
        // Update state form
        const newItems = data.items.map((item) => {
            if (item.id_poin_aspek_penilaian === id_poin) {
                return { ...item, nilai: isNaN(val) ? 0 : val };
            }
            return item;
        });
        setData("items", newItems);
    };

    // 3. Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        // Kirim PUT request ke endpoint update
        // URL: /penguji/penilaian/{id_enrollment_osce}
        router.put(`/penguji/penilaian/${rubrik_data.id_enrollment_osce}`, data, {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: Feedback visual tambahan jika perlu
            }
        });
    };

    // Helper untuk mencari nilai saat ini di form state berdasarkan ID Poin
    const getCurrentScore = (id_poin) => {
        const item = data.items.find(
            (i) => i.id_poin_aspek_penilaian === id_poin
        );
        return item ? item.nilai : 0;
    };

    return (
        <div className="relative bg-white w-full min-h-screen flex justify-start font-sans overflow-hidden">
            <Head title={`Penilaian - ${rubrik_data.mahasiswa.nama}`} />
            
            {/* Gunakan Sidebar yang sama */}
            <Sidebar onToggle={setSidebarOpen} />

            <main
                className={`grid w-full h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-6 transition-all duration-300 ${
                    sidebarOpen ? "ml-0" : "ml-20"
                }`}
            >
                {/* --- HEADER --- */}
                <div className="flex items-center gap-3 text-sm text-gray-700 px-5 py-[10px] border-b border-gray-300 bg-white sticky top-0 z-10">
                    <button
                        onClick={() => window.history.back()} // Atau arahkan ke dashboard penguji
                        className="bg-blue-600 text-white p-[10px] rounded-full hover:bg-blue-700 flex items-center justify-center shadow-sm transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex-1 border border-gray-400 rounded-lg px-4 py-[9px] text-sm font-medium bg-white leading-none flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" />
                        <span>Penilaian OSCE</span>
                        <span className="text-gray-400">/</span>
                        <span>{rubrik_data.info_stase.nama_stase}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-bold truncate">
                            {rubrik_data.mahasiswa.nama} ({rubrik_data.mahasiswa.nim})
                        </span>
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className="flex-1 overflow-auto px-8 pb-8">
                    
                    {/* Informasi Mahasiswa Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-4">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-blue-900">
                                {rubrik_data.mahasiswa.nama}
                            </h2>
                            <div className="flex gap-6 text-sm text-blue-800 mt-1">
                                <p>NIM: <span className="font-medium">{rubrik_data.mahasiswa.nim}</span></p>
                                <p>Stase: <span className="font-medium">{rubrik_data.info_stase.nama_stase}</span></p>
                            </div>
                            <p className="text-xs text-blue-600 mt-2 italic">
                                {rubrik_data.info_stase.deskripsi || "Silakan isi nilai berdasarkan rubrik di bawah ini."}
                            </p>
                        </div>
                    </div>

                    {/* Flash Message Success/Error */}
                    {flash.message && (
                         <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center gap-3 mb-4 animate-fade-in-down">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">{flash.message}</span>
                         </div>
                    )}
                    {flash.error && (
                        <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center gap-3 mb-4">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm">{flash.error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Form Penilaian</h3>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-white font-medium shadow-sm transition-all ${
                                    processing
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700 active:scale-95"
                                }`}
                            >
                                <Save size={18} />
                                {processing ? "Menyimpan..." : "Simpan Penilaian"}
                            </button>
                        </div>

                        {/* Loop Aspek Penilaian */}
                        <div className="space-y-6">
                            {rubrik_data.penilaian.map((aspek, index) => (
                                <div key={aspek.id_aspek} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
                                    {/* Header Aspek */}
                                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex justify-between items-center">
                                        <h4 className="font-bold text-gray-800">
                                            {index + 1}. {aspek.nama_aspek}
                                        </h4>
                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded border border-gray-300">
                                            Bobot Aspek: {aspek.bobot_maksimum}%
                                        </span>
                                    </div>

                                    {/* List Kompetensi (Table Style) */}
                                    <div className="divide-y divide-gray-200">
                                        {aspek.kompetensi_list.map((poin) => {
                                            const currentVal = getCurrentScore(poin.id_poin_aspek_penilaian);
                                            const hasError = errors[`items.${data.items.findIndex(i => i.id_poin_aspek_penilaian === poin.id_poin_aspek_penilaian)}.nilai`];

                                            return (
                                                <div 
                                                    key={poin.id_poin_aspek_penilaian} 
                                                    className={`p-4 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-blue-50 transition-colors ${hasError ? 'bg-red-50' : ''}`}
                                                >
                                                    {/* Deskripsi Kompetensi */}
                                                    <div className="flex-1">
                                                        <p className="text-gray-800 font-medium mb-1">
                                                            {poin.kompetensi}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Maksimal Skor: <span className="font-bold text-gray-700">{poin.skor_maksimal}</span>
                                                        </p>
                                                    </div>

                                                    {/* Input Nilai */}
                                                    <div className="w-full md:w-48 flex flex-col items-end">
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-sm font-medium text-gray-600 mr-2">
                                                                Nilai:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={poin.skor_maksimal}
                                                                step="0.01" // Izinkan desimal jika perlu
                                                                value={currentVal}
                                                                onChange={(e) => handleScoreChange(poin.id_poin_aspek_penilaian, e.target.value, poin.skor_maksimal)}
                                                                className={`w-24 h-10 px-3 border rounded-md text-right font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                                                    hasError 
                                                                        ? 'border-red-500 bg-red-50 text-red-900' 
                                                                        : currentVal > poin.skor_maksimal 
                                                                            ? 'border-yellow-500 text-yellow-700' // Warn if exceeds max
                                                                            : 'border-gray-300 text-blue-900'
                                                                }`}
                                                            />
                                                        </div>
                                                        
                                                        {/* Validation Message per item */}
                                                        {currentVal > poin.skor_maksimal && (
                                                            <span className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                                                                <Info size={10}/> Melebihi max ({poin.skor_maksimal})
                                                            </span>
                                                        )}
                                                        {hasError && (
                                                            <span className="text-xs text-red-600 mt-1">
                                                                {hasError}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Save Button (Floating or Static) */}
                        <div className="mt-8 flex justify-end">
                             <button
                                type="submit"
                                disabled={processing}
                                className={`h-12 px-8 rounded-md text-white font-bold shadow-md transition-all flex items-center gap-2 ${
                                    processing
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                                }`}
                            >
                                <Save size={20} />
                                {processing ? "Menyimpan Data..." : "Simpan Semua Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>

                <OsCopyright />
            </main>
        </div>
    );
}