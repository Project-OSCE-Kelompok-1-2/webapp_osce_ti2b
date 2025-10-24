import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Trash2 } from "lucide-react";

export default function TambahRubrik({ jurusanList = [] }) {
    const { flash } = usePage().props;
    const { data, setData, post, reset, errors } = useForm({
        nama_rubrik: "",
        jurusan_rubrik: "",
        jumlah_template: "",
        bobot_min: "",
        bobot_max: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("rubrik.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Tambah Rubrik" />

            <div className="flex flex-col min-h-screen bg-white">
                {/* ===== Header Breadcrumb ===== */}
                <div className="border-b px-6 py-3 flex items-center gap-2 text-gray-700">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-red-500 text-white p-2 rounded-md"
                    >
                        ✕
                    </button>
                    <span className="text-gray-500 ml-2">
                        Rubrik /{" "}
                        <span className="font-medium">Tambah Rubrik</span>
                    </span>
                </div>

                {/* ===== Main Content ===== */}
                <div className="flex flex-1 items-center justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl border shadow-sm w-full max-w-md"
                    >
                        {/* ===== Header Form ===== */}
                        <div className="bg-gray-800 text-white text-center rounded-t-2xl py-4">
                            <h2 className="text-lg font-semibold">
                                Form Tambah Rubrik
                            </h2>
                            <p className="text-sm text-gray-300">
                                Form ini berisi semua data yang digunakan untuk
                                membuat rubrik
                            </p>
                        </div>

                        {/* ===== Success Message ===== */}
                        {flash.success && (
                            <div className="bg-green-100 text-green-800 text-center py-2 text-sm">
                                ✅ {flash.success}
                            </div>
                        )}

                        {/* ===== Isi Form ===== */}
                        <div className="p-6 space-y-4">
                            {/* Nama Rubrik */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Nama rubrik
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama rubrik..."
                                    value={data.nama_rubrik}
                                    onChange={(e) =>
                                        setData("nama_rubrik", e.target.value)
                                    }
                                    className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none ${
                                        errors.nama_rubrik
                                            ? "border-red-500 focus:ring-red-400"
                                            : "focus:ring-blue-500"
                                    }`}
                                />
                                {errors.nama_rubrik && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.nama_rubrik}
                                    </p>
                                )}
                            </div>

                            {/* Jurusan */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Jurusan rubrik
                                </label>
                                <select
                                    value={data.jurusan_rubrik}
                                    onChange={(e) =>
                                        setData(
                                            "jurusan_rubrik",
                                            e.target.value
                                        )
                                    }
                                    className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                                        errors.jurusan_rubrik
                                            ? "border-red-500 focus:ring-red-400"
                                            : "focus:ring-blue-500"
                                    }`}
                                >
                                    <option value="">Pilih Jurusan...</option>
                                    {jurusanList.map((jurusan, idx) => (
                                        <option key={idx} value={jurusan}>
                                            {jurusan}
                                        </option>
                                    ))}
                                </select>
                                {errors.jurusan_rubrik && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.jurusan_rubrik}
                                    </p>
                                )}
                            </div>

                            {/* Jumlah Template */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Jumlah Template Aspek Penilaian
                                </label>
                                <select
                                    value={data.jumlah_template}
                                    onChange={(e) =>
                                        setData(
                                            "jumlah_template",
                                            e.target.value
                                        )
                                    }
                                    className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                                        errors.jumlah_template
                                            ? "border-red-500 focus:ring-red-400"
                                            : "focus:ring-blue-500"
                                    }`}
                                >
                                    <option value="">Pilih jumlah...</option>
                                    {[5, 10, 15, 20].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                                {errors.jumlah_template && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.jumlah_template}
                                    </p>
                                )}
                            </div>

                            {/* Bobot */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Bobot Minimum
                                    </label>
                                    <select
                                        value={data.bobot_min}
                                        onChange={(e) =>
                                            setData("bobot_min", e.target.value)
                                        }
                                        className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                                            errors.bobot_min
                                                ? "border-red-500 focus:ring-red-400"
                                                : "focus:ring-blue-500"
                                        }`}
                                    >
                                        <option value="">Pilih...</option>
                                        {[1, 2, 3, 4].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.bobot_min && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.bobot_min}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Bobot Maximum
                                    </label>
                                    <select
                                        value={data.bobot_max}
                                        onChange={(e) =>
                                            setData("bobot_max", e.target.value)
                                        }
                                        className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                                            errors.bobot_max
                                                ? "border-red-500 focus:ring-red-400"
                                                : "focus:ring-blue-500"
                                        }`}
                                    >
                                        <option value="">Pilih...</option>
                                        {[2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.bobot_max && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.bobot_max}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tombol */}
                            <div className="flex justify-between items-center pt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <span>📄</span> Submit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-900"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* ===== Footer ===== */}
                <footer className="border-t mt-auto text-center text-gray-500 text-sm py-2">
                    Copyright Porem ipsum dolor sit amet
                </footer>
            </div>
        </>
    );
}
