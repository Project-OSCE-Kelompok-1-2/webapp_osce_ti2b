import React, { useState } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Trash2, Save } from "lucide-react";
import OsCopyright from "../../components/Copyright.jsx";

// === IMPORT MODALS ===
import Modals from "../../components/Modals.jsx";

export default function TambahStase({
    mataKuliah,
    tujuanPembelajaran,
    stase = null,
}) {
    const isEditMode = !!stase;
    const { errors } = usePage().props;

    const { data, setData, post, put, reset, processing } = useForm({
        nama_stase: stase?.nama_stase || "",
        id_mata_kuliah: stase?.id_mata_kuliah?.toString() || "",
        id_tujuan_pembelajaran:
            stase?.id_tujuan_pembelajaran?.toString() || "",
        deskripsi: stase?.deskripsi || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode) {
            put(`/admin/stase/${stase.id_stase}`);
        } else {
            post("/admin/stase", {
                onSuccess: () => reset(),
            });
        }
    };

    // ==== STATE UNTUK MODAL DELETE ====
    const [openResetModal, setOpenResetModal] = useState(false);

    return (
        <>
            <Head title={`Stase | ${isEditMode ? "Edit" : "Tambah"} Stase`} />

            <div className="flex flex-col min-h-screen bg-os-white">
                {/* Header */}
                <div className="flex items-center border-b px-4 py-3">
                    <Link
                        href="/admin/stase"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 mr-3 w-8 h-8 flex items-center justify-center"
                    >
                        ←
                    </Link>
                    <span className="text-gray-700 font-medium">
                        Stase{" "}
                        <span className="text-gray-500">
                            / {isEditMode ? "Edit" : "Tambah"} Stase
                        </span>
                    </span>
                </div>

                {/* FORM */}
                <div className="flex flex-1 items-center justify-center py-10">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md border rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="bg-neutral-800 text-white text-center py-4">
                            <h2 className="text-lg font-semibold">
                                Form {isEditMode ? "Edit" : "Tambah"} Stase
                            </h2>
                            <p className="text-gray-300 text-sm">
                                Form ini berisi semua data yang digunakan untuk{" "}
                                {isEditMode ? "mengubah" : "membuat"} Stase.
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Mata Kuliah */}
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
                                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
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
                            </div>

                            {/* Tujuan Pembelajaran */}
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
                                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
                                >
                                    <option value="">Pilih tujuan...</option>
                                    {tujuanPembelajaran.map((tp) => (
                                        <option
                                            key={tp.id_tujuan_pembelajaran}
                                            value={tp.id_tujuan_pembelajaran}
                                        >
                                            {tp.tujuan}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Nama Stase */}
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
                                    className="mt-1 w-full border rounded-lg px-3 py-2"
                                    placeholder="Masukkan nama stase..."
                                />
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="text-sm text-gray-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData("deskripsi", e.target.value)
                                    }
                                    className="mt-1 w-full border rounded-lg px-3 py-2"
                                    rows="3"
                                    placeholder="Masukkan deskripsi singkat..."
                                ></textarea>
                            </div>

                            {/* BUTTON */}
                            <div className="flex justify-between pt-4">
                                {/* SUBMIT */}
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    Submit
                                </button>

                                {/* RESET — PAKAI MODAL */}
                                <button
                                    type="button"
                                    onClick={() => setOpenResetModal(true)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <footer className="mt-6 border-t border-gray-200">
                    <OsCopyright />
                </footer>
            </div>

            {/* =============== MODAL RESET =============== */}
            <Modals
                isOpen={openResetModal}
                onClose={() => setOpenResetModal(false)}
                variant="delete"
                dataToDelete={[
                    { key: "Form", value: "Semua input akan dikosongkan." },
                ]}
                onConfirm={() => {
                    reset();
                    setOpenResetModal(false);
                }}
            />
        </>
    );
}
