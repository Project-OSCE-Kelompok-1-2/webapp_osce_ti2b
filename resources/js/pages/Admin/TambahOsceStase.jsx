import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
export default function TambahStase({
    osce,
    ruanganOptions = [],
    staseOptions = [],
    pengujiOptions = [],
}) {
    // 3. 'useForm' adalah cara paling elegan di Inertia.
    //    Dia sudah menangani state, error, dan status 'processing'.
    const { data, setData, post, processing, errors, reset } = useForm({
        id_ruang: "",
        id_stase: "",
        id_penguji: "",
    });

    const { id_osce, flash } = usePage().props;

    // 4. Fungsi untuk submit form
    function handleSubmit(e) {
        e.preventDefault();
        // 'post' akan mengirim data ke route 'admin.stase.store'.
        // Pastikan Anda punya route ini di web.php
        post(`/osce/${id_osce}/stase`, { osce: osce.id }),
            {
                onSuccess: () => reset(), // Reset form jika sukses
            };
    }

    // 5. Fungsi untuk tombol "Trash"
    function handleClearForm() {
        reset(); // Membersihkan semua input form
    }

    return (
        // Layout: Header - Main - Footer
        <div className="min-h-screen flex flex-col">
            <Head title="Tambah Stase" />

            {/* Header / Breadcrumb */}
            <header className="flex items-center gap-3 p-4 bg-white border-b sticky top-0 z-10">
                {/* Tombol Back, pakai 'Link' dari Inertia */}
                <button
                    onClick={() => {
                        router.visit("/stase");
                    }}
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    <ArrowLeft size={20} />
                </button>
                {/* Breadcrumb dinamis dari props 'osce' */}
                <div className="flex-1 border rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50">
                    OSCE \ {osce?.nama} \ Halaman Stase \ Tambah Stase
                </div>
            </header>

            {/* Main Content (Form) */}
            <main className="flex-1 flex items-center justify-center p-6">
                {/* 6. Bungkus seluruh card dengan <form> */}
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className="border w-full max-w-[400px] mx-auto border-gray-300 rounded-lg overflow-hidden shadow-lg">
                        {/* Card Header (Dark) */}
                        <div className="bg-gray-800 text-white p-6 text-center">
                            <h2 className="text-xl font-semibold mb-1">
                                Form Tambah Stase
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Jorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Nunc vulputate libero et velit
                                interdum, ac aliquet odio mattis.
                            </p>
                        </div>

                        {/* Card Body (White) */}
                        <div className="bg-white p-6 space-y-5">
                            {/* Ruangan Stase */}
                            <div>
                                <label
                                    htmlFor="ruangan"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Ruangan Stase
                                </label>
                                <select
                                    id="ruangan"
                                    value={data.id_ruang}
                                    onChange={(e) =>
                                        setData("id_ruang", e.target.value)
                                    }
                                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-white ${
                                        errors.ruangan_id
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Pilih Ruangan</option>
                                    {/* 7. Loop 'ruanganOptions' dari props */}
                                    {ruanganOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {/* 8. Menampilkan error validasi (jika ada) */}
                                {errors.ruangan_id && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {errors.ruangan_id}
                                    </div>
                                )}
                            </div>

                            {/* Stase */}
                            <div>
                                <label
                                    htmlFor="stase"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Stase
                                </label>
                                <select
                                    id="stase"
                                    value={data.id_stase}
                                    onChange={(e) =>
                                        setData("id_stase", e.target.value)
                                    }
                                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-white ${
                                        errors.stase_id
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Pilih Stase</option>
                                    {/* 7. Loop 'staseOptions' dari props */}
                                    {staseOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.stase_id && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {errors.stase_id}
                                    </div>
                                )}
                            </div>

                            {/* Penguji */}
                            <div>
                                <label
                                    htmlFor="penguji"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Penguji
                                </label>
                                <select
                                    id="penguji"
                                    value={data.id_penguji}
                                    onChange={(e) =>
                                        setData("id_penguji", e.target.value)
                                    }
                                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-white ${
                                        errors.penguji_id
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Pilih Penguji</option>
                                    {/* 7. Loop 'pengujiOptions' dari props */}
                                    {pengujiOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.penguji_id && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {errors.penguji_id}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 pt-[5rem]">
                                <button
                                    type="submit"
                                    disabled={processing} // 9. Tombol 'disabled' saat 'post' berjalan
                                    className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
                                >
                                    <Send size={16} className="mr-2" />
                                    {/* 9. Teks tombol ganti saat loading */}
                                    {processing ? "Menyimpan..." : "Submit"}
                                </button>
                                <button
                                    type="button" // 10. Tipe 'button' agar tidak men-submit form
                                    onClick={handleClearForm}
                                    className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            {flash?.success && (
                <div>
                    <h1 className="text-green-500 text-xl">Berhasil dibuat!</h1>
                </div>
            )}

            {/* Footer */}
            <footer className="p-4 bg-white border-t mt-auto">
                <div className="border rounded-lg px-4 py-3 text-center text-gray-500 text-xs">
                    Copyright Porem ipsum dolor sit ametPorem ipsum dolor sit
                    amet
                </div>
            </footer>
        </div>
    );
}
