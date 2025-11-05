import React from "react";
import { Trash2, Save, X } from "lucide-react";
// 👇 [UBAH] Impor hook yang diperlukan dari Inertia
import { useForm, usePage, Link } from "@inertiajs/react";

// [FIX] Ganti nama 'KompetensiForm' menjadi 'TambahKompetensi'
export default function TambahKompetensi() {
    // 1. [FIX] Ambil 'aspek', 'errors', dan 'kompetensi' (yang bisa jadi null)
    const { aspek, kompetensi = null, errors } = usePage().props;

    // 2. [FIX] Tentukan apakah ini mode edit (VARIABEL YANG HILANG)
    const isEditMode = !!kompetensi;

    // 3. [FIX] Ambil 'put' dari useForm dan isi data awal jika mode edit
    const { data, setData, post, put, processing, reset } = useForm({
        // Sesuaikan nama field dengan kolom database
        kompetensi: kompetensi ? kompetensi.kompetensi : "",
        bobot: kompetensi ? kompetensi.bobot : 1, // Default ke 1 jika mode create
    });

    // 4. Fungsi 'handleSubmit' Anda sekarang akan BERFUNGSI
    function handleSubmit(e) {
        e.preventDefault();

        if (isEditMode) {
            // <-- Variabel 'isEditMode' sekarang sudah didefinisikan
            // Mode EDIT: Kirim PUT ke /admin/kompetensi/{id}
            put(`/admin/kompetensi/${kompetensi.id_poin_aspek_penilaian}`);
        } else {
            // Mode CREATE: Kirim POST ke /admin/aspek-penilaian/{id}/kompetensi
            post(
                `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi`
            );
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-os-white rounded-lg p-4">
            {/* ======= HEADER ======= */}
            <header className="bg-white border-b border-gray-300 px-3 py-3 flex items-center justify-between gap-3">
                <Link
                    href={`/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi`}
                    className="bg-red-600 text-white p-3 rounded-xl border border-black hover:bg-red-500 transition-all"
                >
                    <X size={20} />
                </Link>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    <p className="text-black text-base sm:text-lg truncate">
                        {aspek.stase.nama_stase} / {aspek.aspek} /
                        {/* [FIX] Judul dinamis */}
                        {isEditMode ? " Edit Kompetensi" : " Tambah Kompetensi"}
                    </p>
                </div>
            </header>

            {/* Form */}
            <main className="flex-1 flex justify-center items-center sm:items-center p-4 sm:p-10">
                <div className="w-full sm:max-w-md bg-white border border-gray-700 rounded-xl shadow-md overflow-hidden">
                    {/* Header Card */}
                    <div className="bg-neutral-800 text-white text-center py-6 px-4">
                        <h2 className="text-xl font-semibold">
                            {/* [FIX] Judul dinamis */}
                            Form {isEditMode ? "Edit" : "Tambah"} Kompetensi
                        </h2>
                        <p className="text-sm text-gray-300 mt-1">
                            {/* ... (Deskripsi) ... */}
                        </p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-2">
                        {/* Deskripsi */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Deskripsi Kompetensi
                            </label>
                            <textarea
                                value={data.kompetensi}
                                onChange={(e) =>
                                    setData("kompetensi", e.target.value)
                                }
                                placeholder="Masukkan deskripsi kompetensi..."
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={4}
                                required
                            />
                            {errors.kompetensi && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.kompetensi}
                                </p>
                            )}
                        </div>

                        {/* Bobot */}
                        <div>
                            <label className="block text-xs text-gray-700 font-semibold mb-1">
                                Bobot
                            </label>
                            <select
                                value={data.bobot}
                                onChange={(e) =>
                                    setData("bobot", Number(e.target.value))
                                }
                                className="w-full border border-gray-700 rounded-lg p-3 text-sm bg-os-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                            {errors.bobot && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.bobot}
                                </p>
                            )}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-500 text-white px-10 py-3 rounded-xl transition-all w-full disabled:opacity-50"
                            >
                                <Save size={20} />
                                {/* [FIX] Teks tombol dinamis */}
                                {processing
                                    ? "Menyimpan..."
                                    : isEditMode
                                    ? "Perbarui"
                                    : "Submit"}
                            </button>

                            <button
                                type="button"
                                onClick={() => reset()}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-3 rounded-xl text-sm border transition-all w-full sm:w-auto"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* ======= FOOTER ======= */}
            <footer className="border border-black rounded-xl text-start px-4 py-4 text-sm text-gray-600">
                © Jorem ipsum dolor sit amet, consectetur adipiscing elit.
            </footer>
        </div>
    );
}
