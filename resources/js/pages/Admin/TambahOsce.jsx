import { Head, router, useForm, usePage, Link } from "@inertiajs/react"; // [UBAH] Import Link dan useForm
import { ChevronLeft, Trash2, Send } from "lucide-react"; // [UBAH] Hapus ikon tanggal yang tidak perlu
import React from "react"; // [UBAH] Import React

// [UBAH] Terima props 'tahunAkademikOptions' dari controller
export default function TambahOsce({ tahunAkademikOptions = [], osce = null }) {
    const { errors } = usePage().props;

    // [UBAH] Tentukan mode edit
    const isEditMode = !!osce;

    // [UBAH] Isi form dengan data 'osce' jika ada
    const { data, setData, post, put, processing, reset } = useForm({
        nama_osce: osce ? osce.nama_osce : "",
        id_tahun_akademik: osce ? osce.id_tahun_akademik : "",
        tanggal_mulai: osce ? osce.tanggal_mulai : "",
        tanggal_selesai: osce ? osce.tanggal_selesai : "",
    });

    // [UBAH] Buat fungsi handleSubmit
    function handleSubmit(e) {
        e.preventDefault();

        if (isEditMode) {
            // Kirim PUT ke endpoint 'update' Bintang
            put(`/admin/osce/${osce.id_osce}`, {
                onSuccess: () => router.get("/admin/osce"),
            });
        } else {
            // Kirim POST ke endpoint 'store' Bintang
            post("/admin/osce", {
                onSuccess: () => router.get("/admin/osce"),
            });
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Head title="Tambah OSCE" />

            {/* Header Atas */}
            <header className="flex items-center gap-3 p-4 border-b bg-gray-50">
                {/* [UBAH] Gunakan Link, bukan router.visit */}
                <Link
                    href="/admin/osce" // <-- Arahkan ke endpoint list yang benar
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 flex items-center justify-center transition"
                >
                    <ChevronLeft size={20} />
                </Link>

                <input
                    type="text"
                    value="OSCE / Tambah OSCE"
                    readOnly
                    className="border rounded-lg px-4 py-2 text-sm w-full focus:outline-none bg-white"
                />
            </header>

            {/* Main Content */}
            <main className="flex flex-1 items-center justify-center py-[5rem]">
                {/* [UBAH] Ganti <div> menjadi <form> */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-[400px] border rounded-xl overflow-hidden shadow-sm"
                >
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
                            <label
                                htmlFor="nama_osce"
                                className="text-sm font-medium text-gray-700"
                            >
                                Nama OSCE
                            </label>
                            <input
                                id="nama_osce"
                                type="text"
                                placeholder="Masukkan nama OSCE..."
                                className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                    errors.nama_osce
                                        ? "border-red-500 ring-red-500"
                                        : "focus:ring-blue-500 border-gray-300"
                                }`}
                                // [UBAH] Hubungkan ke state
                                value={data.nama_osce}
                                onChange={(e) =>
                                    setData("nama_osce", e.target.value)
                                }
                            />
                            {errors.nama_osce && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.nama_osce}
                                </div>
                            )}
                        </div>

                        {/* Tahun Akademik */}
                        <div>
                            <label
                                htmlFor="id_tahun_akademik"
                                className="text-sm font-medium text-gray-700"
                            >
                                Tahun Akademik
                            </label>
                            <select
                                id="id_tahun_akademik"
                                className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                    errors.id_tahun_akademik
                                        ? "border-red-500 ring-red-500"
                                        : "focus:ring-blue-500 border-gray-300"
                                } bg-white`}
                                // [UBAH] Hubungkan ke state
                                value={data.id_tahun_akademik}
                                onChange={(e) =>
                                    setData("id_tahun_akademik", e.target.value)
                                }
                            >
                                <option value="">Pilih Tahun</option>
                                {/* [UBAH] Loop data dinamis dari props */}
                                {tahunAkademikOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.id_tahun_akademik && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.id_tahun_akademik}
                                </div>
                            )}
                        </div>

                        {/* Jadwal Mulai dan Akhir */}
                        <div className="flex gap-3 ">
                            <div className="w-1/2">
                                <label
                                    htmlFor="tanggal_mulai"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Jadwal Mulai
                                </label>
                                <div className="mt-1 flex items-center border rounded-lg">
                                    {/* [UBAH] Ganti ke type="date" */}
                                    <input
                                        id="tanggal_mulai"
                                        type="date"
                                        className={`flex-1 text-sm outline-none bg-white px-3 py-2 rounded-lg ${
                                            errors.tanggal_mulai
                                                ? "border-red-500"
                                                : "border-transparent"
                                        }`}
                                        // [UBAH] Hubungkan ke state
                                        value={data.tanggal_mulai}
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_mulai",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                {errors.tanggal_mulai && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {errors.tanggal_mulai}
                                    </div>
                                )}
                            </div>

                            <div className="w-1/2">
                                <label
                                    htmlFor="tanggal_selesai"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Jadwal Akhir
                                </label>
                                <div className="mt-1 flex items-center border rounded-lg">
                                    {/* [UBAH] Ganti ke type="date" */}
                                    <input
                                        id="tanggal_selesai"
                                        type="date"
                                        className={`flex-1 text-sm outline-none bg-white px-3 py-2 rounded-lg ${
                                            errors.tanggal_selesai
                                                ? "border-red-500"
                                                : "border-transparent"
                                        }`}
                                        // [UBAH] Hubungkan ke state
                                        value={data.tanggal_selesai}
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_selesai",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                {errors.tanggal_selesai && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {errors.tanggal_selesai}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tombol Submit dan Delete */}
                        <div className="flex items-center justify-between pt-[5rem]">
                            <button
                                type="submit" // [UBAH] Tambah type
                                disabled={processing} // [UBAH] Disable saat loading
                                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm flex-1 mr-2 transition disabled:opacity-50"
                            >
                                <Send size={16} className="mr-2" />
                                {processing ? "Menyimpan..." : "Submit"}
                            </button>
                            <button
                                type="button" // [UBAH] Tambah type
                                onClick={() => reset()} // [UBAH] Tambah onClick reset
                                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </form>
            </main>

            {/* Footer */}
            <footer className="border text-center text-gray-600 text-xs py-3 mt-4 mx-4 rounded-lg bg-gray-50">
                © 2025 — OSCE Management System
            </footer>
        </div>
    );
}
