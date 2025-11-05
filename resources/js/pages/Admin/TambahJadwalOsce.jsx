import React from "react";
// === Impor hook dan komponen Inertia ===
import { Head, useForm, Link, router } from "@inertiajs/react";
// === Impor ikon-ikon ===
import { ChevronLeft, Trash2, Calendar, Save } from "lucide-react";

export default function TambahSesi() {
    
    // Gunakan 'useForm' untuk mengelola state form
    const { data, setData, post, processing, errors } = useForm({
        jadwal_mulai: "2025-01-01", // Contoh data awal
    });

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        // Ganti 'admin.sesi.store' dengan nama route-mu yang sebenarnya
        // post(route('admin.sesi.store'));
        alert("Submit data: " + JSON.stringify(data));
    };

    return (
        <>
            <Head title="Tambah Sesi" />

            {/* Layout utama: flex-col, h-screen */}
            <div className="flex flex-col min-h-screen bg-gray-50">
                
                {/* ===== Breadcrumb Header ===== */}
                <header className="flex items-center gap-3 text-sm text-gray-700 p-4 border-b border-gray-300 bg-white">
                    <Link
                        // Ganti href ini ke halaman list JadwalSesi
                        href="#" 
                        className="bg-blue-600 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-700"
                        title="Kembali"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex-1 border border-gray-400 rounded-lg px-4 py-2 text-sm font-medium bg-white">
                        OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi \ Tambah Sesi
                    </div>
                </header>

                {/* ===== Form Container (Centered) ===== */}
                {/* flex-1 akan mengisi sisa ruang, items-center & justify-center akan memusatkan form */}
                <main className="flex flex-1 items-center justify-center p-6">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-lg border rounded-xl shadow-lg overflow-hidden"
                    >
                        {/* ===== Header Form ===== */}
                        <div className="bg-neutral-800 text-white text-center p-6">
                            <h2 className="text-xl font-semibold">
                                Form Jadwal Ujian
                            </h2>
                            <p className="text-gray-300 text-sm mt-1">
                                Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                            </p>
                        </div>

                        {/* ===== Isi Form ===== */}
                        <div className="p-6 bg-white space-y-5">
                            <div>
                                <label htmlFor="jadwal-mulai" className="text-sm font-medium text-gray-700 block mb-2">
                                    Jadwal mulai
                                </label>
                                <div className="relative">
                                    <input
                                        id="jadwal-mulai"
                                        type="text" // Ganti ke type="date" jika kamu mau kalender asli
                                        value={data.jadwal_mulai}
                                        onChange={(e) => setData("jadwal_mulai", e.target.value)}
                                        className="w-full border border-gray-400 rounded-lg p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Fri 01-01-2025"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Calendar className="text-gray-500" size={18} />
                                    </div>
                                </div>
                                {errors.jadwal_mulai && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.jadwal_mulai}
                                    </p>
                                )}
                            </div>

                            {/* ===== Tombol Aksi ===== */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {processing ? 'Menyimpan...' : 'Submit'}
                                </button>
                                <button
                                    type="button"
                                    // onClick={() => reset()} // Fungsi untuk clear form
                                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg flex items-center justify-center"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* ===== Footer ===== */}
                <footer className="text-center text-gray-400 text-sm p-4 mt-auto">
                     <div className="border-t border-gray-300 py-4">
                        Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
                     </div>
                </footer>
            </div>
        </>
    );
}