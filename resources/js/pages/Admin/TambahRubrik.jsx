import React from "react";
// INI KUNCINYA: Import 'Link' dan 'useForm'
import { Head, Link, useForm } from "@inertiajs/react";

// --- Komponen SVG untuk Halaman Ini ---
const CloseIcon = () => (
    <svg
        className="w-5 h-5 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);
const SaveIcon = () => (
    <svg
        className="w-4 h-4 mr-2"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586L7.707 10.293zM3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
    </svg>
);
const TrashIconWhite = () => (
    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
            clipRule="evenodd"
        />
    </svg>
);
// --- End SVG ---

export default function CreateRubrikPage() {
    // INI KUNCINYA: Gunakan hook useForm dari Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_rubrik: "",
        tipe_rubrik: "Jurusan...",
        jumlah_kompetensi: "15",
    });

    // Fungsi untuk menangani submit form
    function handleSubmit(e) {
        e.preventDefault();
        // Kirim data ke rute 'rubrik.store' di backend
        post(route("rubrik.store"));
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <Head title="Tambah Rubrik" />

            {/* --- Breadcrumb Bar --- */}
            <div className="flex items-center border border-gray-300 rounded-lg p-3 mb-8 shadow-sm">
                {/* Tombol 'X' ini adalah <Link> yang kembali ke halaman index */}
                <Link
                    href={route("rubrik.index")} // Kembali ke halaman daftar
                    className="p-2 rounded-full hover:bg-gray-100 mr-3"
                    as="button"
                >
                    <CloseIcon />
                </Link>
                <div>
                    <span className="text-gray-500 text-sm">
                        Dashboard / Rubrik /{" "}
                    </span>
                    <span className="text-gray-800 text-sm font-medium">
                        Tambah Rubrik
                    </span>
                </div>
            </div>

            {/* --- Form Container --- */}
            <div className="w-full max-w-lg mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                {/* Header Form */}
                <div className="bg-gray-800 text-white p-6 text-center">
                    <h2 className="text-xl font-bold">Form data rubrik</h2>
                    <p className="text-sm text-gray-300 mt-2">
                        Horem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nunc vulputate libero et velit interdum, ac aliquet odio
                        mattis.
                    </p>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="bg-white p-6">
                    <div className="space-y-4">
                        {/* Input Nama Rubrik */}
                        <div>
                            <label
                                htmlFor="nama_rubrik"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nama rubrik
                            </label>
                            <input
                                type="text"
                                id="nama_rubrik"
                                value={data.nama_rubrik}
                                onChange={(e) =>
                                    setData("nama_rubrik", e.target.value)
                                }
                                placeholder="Masukkan nama rubrik"
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {/* Menampilkan error validasi dari Laravel */}
                            {errors.nama_rubrik && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors.nama_rubrik}
                                </div>
                            )}
                        </div>

                        {/* Select Tipe Rubrik */}
                        <div>
                            <label
                                htmlFor="tipe_rubrik"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Tipe rubrik
                            </label>
                            <select
                                id="tipe_rubrik"
                                value={data.tipe_rubrik}
                                onChange={(e) =>
                                    setData("tipe_rubrik", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Jurusan...</option>
                                <option value="opsi1">Opsi 1</option>
                                <option value="opsi2">Opsi 2</option>
                            </select>
                        </div>

                        {/* Select Jumlah Kompetensi */}
                        <div>
                            <label
                                htmlFor="jumlah_kompetensi"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Jumlah Kompetensi
                            </label>
                            <select
                                id="jumlah_kompetensi"
                                value={data.jumlah_kompetensi}
                                onChange={(e) =>
                                    setData("jumlah_kompetensi", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="15">15</option>
                                <option value="10">10</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer Form (Tombol) */}
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={processing} // Tombol dinonaktifkan saat 'processing'
                            className="flex items-center justify-center bg-gray-800 text-white text-sm font-medium py-2 px-5 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50"
                        >
                            <SaveIcon />
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={() => reset()} // Tombol ini me-reset form
                            className="p-2 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        >
                            <TrashIconWhite />
                        </button>
                    </div>
                </form>
            </div>

            {/* --- Footer Halaman --- */}
            <footer className="text-gray-500 text-sm p-4 border border-gray-300 rounded-lg mt-8">
                Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit amet
            </footer>
        </div>
    );
}
