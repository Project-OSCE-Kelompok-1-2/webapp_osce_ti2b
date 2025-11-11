import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";

// 1. Terima props yang sudah benar dari controller
export default function TambahStase({
    osce,
    ruanganOptions = [],
    staseOptions = [],
    pengujiOptions = [],
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id_ruang: "",
        id_stase: "",
        id_penguji: "",
    });

    const { flash } = usePage().props;

    function handleSubmit(e) {
        e.preventDefault();

        // 'post' (method) + 'admin' (prefix) + '/osce/{id_osce}/stase' (route)
        const url = `/admin/osce/${osce.id_osce}/stase`;

        // Sintaks post yang benar: post(url, options)
        post(url, {
            onSuccess: () => reset(), // Reset form jika sukses
        });
    }

    function handleClearForm() {
        reset();
    }

    function handleBack() {
        // Kembali ke halaman list stase untuk OSCE ini
        router.visit(`/admin/osce/${osce.id_osce}/stase`);
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head title={`Tambah Stase - ${osce.nama_osce}`} />

            {/* Header / Breadcrumb */}
            <header className="flex items-center gap-3 p-4 bg-white border-b sticky top-0 z-10">
                <button
                    type="button"
                    onClick={handleBack}
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 border rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50">
                    {/* Gunakan nama_osce dari prop */}
                    OSCE / {osce?.nama_osce} / Halaman Stase / Tambah Stase
                </div>
            </header>

            {/* Main Content (Form) */}
            <main className="flex-1 flex items-center justify-center p-6">
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className="border w-full max-w-[400px] mx-auto border-gray-300 rounded-lg overflow-hidden shadow-lg">
                        {/* Card Header (Dark) */}
                        <div className="bg-gray-800 text-white p-6 text-center">
                            <h2 className="text-xl font-semibold mb-1">
                                Form Tambah Stase
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Masukkan stase baru untuk OSCE: <br />
                                <strong>{osce.nama_osce}</strong>
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
                                        errors.id_ruang
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Pilih Ruangan</option>
                                    {/* Loop 'ruanganOptions' dari props */}
                                    {ruanganOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {/* Label sudah benar (nomor_ruangan) */}
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_ruang && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {errors.id_ruang}
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
                                        errors.id_stase
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Pilih Stase</option>
                                    {/* Loop 'staseOptions' dari props */}
                                    {staseOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_stase && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {errors.id_stase}
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
                                    // [PERBAIKAN] Cek error 'id_penguji'
                                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-white ${
                                        errors.id_penguji
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Pilih Penguji</option>
                                    {pengujiOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_penguji && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {errors.id_penguji}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
                                >
                                    <Send size={16} className="mr-2" />
                                    {processing ? "Menyimpan..." : "Submit"}
                                </button>
                                <button
                                    type="button"
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

            {/* Flash Message (Notifikasi Sukses) */}
            {flash?.success && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
                    {flash.success}
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
