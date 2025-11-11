import React from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Trash2, Save } from "lucide-react";

export default function TambahStase({
    mataKuliah,
    tujuanPembelajaran,
    stase = null,
}) {
    const isEditMode = !!stase;
    const { errors } = usePage().props;

    const { data, setData, post, put, reset, processing } = useForm({
        nama_stase: stase?.nama_stase || "",
        id_mata_kuliah: stase?.id_mata_kuliah || "",
        id_tujuan_pembelajaran: stase?.id_tujuan_pembelajaran || "",
        deskripsi: stase?.deskripsi || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            // Jika mode edit, kirim request PUT ke URL update
            put(`/admin/stase/${stase.id_stase}`);
        } else {
            // Jika mode tambah, kirim request POST ke URL store
            post("/admin/stase", {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <>
            {/* [UBAH] Judul halaman dinamis */}
            <Head title={`Stase | ${isEditMode ? "Edit" : "Tambah"} Stase`} />

            <div className="flex flex-col min-h-screen bg-os-white">
                <div className="flex items-center border-b px-4 py-3">
                    <Link
                        href="/admin/stase"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 mr-3 w-8 h-8 flex items-center justify-center leading-none"
                    >
                        ←
                    </Link>
                    <span className="text-gray-700 font-medium">
                        Stase {/* [UBAH] Breadcrumb dinamis */}
                        <span className="text-gray-500">
                            / {isEditMode ? "Edit" : "Tambah"} Stase
                        </span>
                    </span>
                </div>

                <div className="flex flex-1 items-center justify-center py-10">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md border rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="bg-neutral-800 text-white text-center py-4">
                            {/* [UBAH] Judul form dinamis */}
                            <h2 className="text-lg font-semibold">
                                Form {isEditMode ? "Edit" : "Tambah"} Stase
                            </h2>
                            <p className="text-gray-300 text-sm">
                                Form ini berisi semua data yang digunakan untuk{" "}
                                {isEditMode ? "mengubah" : "membuat"} Stase
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Semua input di bawah ini sekarang sudah terisi otomatis jika dalam mode edit */}
                            <div>
                                <label className="text-sm text-gray-700">
                                    Mata Kuliah
                                </label>
                                <select
                                    value={data.id_mata_kuliah}
                                    onChange={(e) =>
                                        setData(
                                            "id_mata_kuliah",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-white ..."
                                >
                                    <option value="">
                                        Pilih Mata Kuliah...
                                    </option>
                                    {mataKuliah.map((mk) => (
                                        <option
                                            key={mk.id_mata_kuliah}
                                            value={mk.id_mata_kuliah}
                                        >
                                            {mk.nama_mata_kuliah}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_mata_kuliah && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.id_mata_kuliah}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">
                                    Tujuan Pembelajaran
                                </label>
                                <select
                                    value={data.id_tujuan_pembelajaran}
                                    onChange={(e) =>
                                        setData(
                                            "id_tujuan_pembelajaran",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-white ..."
                                >
                                    <option value="">
                                        Pilih Tujuan Pembelajaran...
                                    </option>
                                    {tujuanPembelajaran.map((tp) => (
                                        <option
                                            key={tp.id_tujuan_pembelajaran}
                                            value={tp.id_tujuan_pembelajaran}
                                        >
                                            {tp.tujuan}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_tujuan_pembelajaran && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.id_tujuan_pembelajaran}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">
                                    Nama Stase
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_stase}
                                    onChange={(e) =>
                                        setData("nama_stase", e.target.value)
                                    }
                                    className="mt-1 w-full border rounded-lg px-3 py-2 ..."
                                    placeholder="Masukkan nama stase..."
                                />
                                {errors.nama_stase && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.nama_stase}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData("deskripsi", e.target.value)
                                    }
                                    className="mt-1 w-full border rounded-lg px-3 py-2 ..."
                                    placeholder="Masukkan deskripsi singkat stase..."
                                    rows="3"
                                ></textarea>
                                {errors.deskripsi && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.deskripsi}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {processing ? "Menyimpan..." : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <footer className="border-t mt-auto text-center text-gray-500 text-sm py-2">
                    Copyright Porem ipsum dolor sit amet
                </footer>
            </div>
        </>
    );
}
