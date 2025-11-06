import { Head, router } from "@inertiajs/react";
import { ChevronLeft, CalendarDays, Trash2, Send, CalendarClock } from "lucide-react";

export default function TambahOsce() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Head title="Tambah OSCE" />

            {/* Header Atas */}
            <header className="flex items-center gap-3 p-4 border-b bg-gray-50">
                <button
                    onClick={() => router.visit("/osce")}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 flex items-center justify-center transition"
                >
                    <ChevronLeft size={20} />
                </button>

                <input
                    type="text"
                    value="OSCE / Tambah OSCE"
                    readOnly
                    className="border rounded-lg px-4 py-2 text-sm w-full focus:outline-none bg-white"
                />
            </header>

            {/* Main Content */}
            <main className="flex flex-1 items-center justify-center py-[5rem]">
                <div className="w-full max-w-[400px] border rounded-xl overflow-hidden shadow-sm">
                    {/* Card Header */}
                    <div className="bg-gray-800 text-white p-5 text-center">
                        <h2 className="text-lg font-semibold mb-1">
                            Form Tambah OSCE
                        </h2>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto">
                            Silakan isi form berikut untuk menambahkan data OSCE
                            baru.
                        </p>
                    </div>

                    {/* Form Body */}
                    <div className="p-5 space-y-4">
                        {/* Nama OSCE */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Nama OSCE
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nama OSCE..."
                                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Tahun Akademik */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Tahun Akademik
                            </label>
                            <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                                <option value="">Pilih Tahun</option>
                                <option>2025</option>
                                <option>2026</option>
                            </select>
                        </div>

                        {/* Jadwal Mulai dan Akhir */}
                        <div className="flex gap-3 ">
                            <div className="w-1/2">
                                {/* Label (Teks saja) */}
                                <label className="text-sm font-medium text-gray-700">
                                    Jadwal Mulai
                                </label>

                                {/* Input (dengan ikon di dalam) */}
                                <div className="mt-1 flex items-center border rounded-lg px-3 py-2">
                                    <input
                                        type="text"
                                        value="Fri 01-01-2025"
                                        readOnly
                                        className="flex-1 text-sm outline-none bg-white"
                                    />
                                    <CalendarDays
                                        size={16}
                                        className="text-gray-600 ml-2"
                                    />
                                </div>
                            </div>

                            <div className="w-1/2">
                                {/* Label (Teks saja) */}
                                <label className="text-sm font-medium text-gray-700">
                                    Jadwal Akhir
                                </label>

                                {/* Input (dengan ikon di dalam) */}
                                <div className="mt-1 flex items-center border rounded-lg px-3 py-2">
                                    <input
                                        type="text"
                                        value="Fri 01-01-2025"
                                        readOnly
                                        className="flex-1 text-sm outline-none bg-white"
                                    />
                                    <CalendarDays
                                        size={16}
                                        className="text-gray-600 ml-2"
                                    />
                                    <CalendarClock size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Tombol Submit dan Delete */}
                        <div className="flex items-center justify-between pt-[5rem]">
                            <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm flex-1 mr-2 transition">
                                <Send size={16} className="mr-2" />
                                Submit
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border text-center text-gray-600 text-xs py-3 mt-4 mx-4 rounded-lg bg-gray-50">
                © 2025 — OSCE Management System
            </footer>
        </div>
    );
}
