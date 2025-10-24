import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { mockKompetensi } from "../../mockdata/kompetensiData";

const Kompetensi = () => {
    const [kompetensiList, setKompetensiList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // state modal dan form tambah
    const [showModal, setShowModal] = useState(false);
    const [newKompetensi, setNewKompetensi] = useState({
        deskripsi: "",
        bobot: "",
        skor: "",
        keterangan_skor: "Belum disetting",
    });

    // ambil data mock
    const fetchKompetensi = async () => {
        try {
            await new Promise((r) => setTimeout(r, 500)); // simulasi delay
            setKompetensiList(mockKompetensi);
        } catch (error) {
            console.error("Gagal mengambil data kompetensi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKompetensi();
    }, []);

    // buka modal tambah
    const handleTambahKompetensi = () => {
        setShowModal(true);
    };

    // submit tambah kompetensi ke list lokal
    const handleSubmitKompetensi = (e) => {
        e.preventDefault();
        const newData = {
            id: kompetensiList.length + 1,
            ...newKompetensi,
        };
        setKompetensiList([...kompetensiList, newData]);
        setShowModal(false);
        setNewKompetensi({
            deskripsi: "",
            bobot: "",
            skor: "",
            keterangan_skor: "Belum disetting",
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="flex-1 p-8 pl-32">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <button className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600">
                        ←
                    </button>
                    <input
                        type="text"
                        value="Rubrik / Packet Rubrik 1 / Aspek Penilaian"
                        readOnly
                        className="flex-1 border rounded-lg px-3 py-2 text-sm text-gray-600 bg-white"
                    />
                </div>

                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Menu Aspek Penilaian
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Halaman ini berisi aspek-aspek yang nanti dinilai oleh penguji, setiap rubrik bisa memiliki berbagai macam aspek penilaian.
                    </p>
                </div>

                {/* Tombol utama */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <button
                        onClick={handleTambahKompetensi}
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                    >
                        <span className="text-lg">＋</span> Tambah Aspek Penilaian
                    </button>
                    <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
                        ✎ Edit Skenario
                    </button>
                    <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
                        📝 Edit Point Aspek Penilaian
                    </button>
                </div>

                {/* Search bar panjang di bawah tombol */}
                <div className="flex items-center w-full gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Tuliskan data aspek penilaian..."
                        className="flex-1 border border-black rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                    <button className="bg-blue-700 hover:bg-blue-600 text-white px-24 py-2 rounded-lg transition">
                        Cari
                    </button>
                </div>

                {/* Tabel Kompetensi */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <h3 className="px-4 py-3 border-b text-gray-700 font-medium">
                        Table Kompetensi
                    </h3>

                    {isLoading ? (
                        <p className="text-center py-6 text-gray-500">
                            Memuat data...
                        </p>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm">
                                    <th className="py-3 px-4 border">No</th>
                                    <th className="py-3 px-4 border text-left">
                                        Kompetensi
                                    </th>
                                    <th className="py-3 px-4 border">Bobot</th>
                                    <th className="py-3 px-4 border">
                                        Skor Maks
                                    </th>
                                    <th className="py-3 px-4 border">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {kompetensiList.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={`text-gray-800 text-sm ${
                                            index % 2 === 1
                                                ? "bg-gray-50"
                                                : "bg-white"
                                        }`}
                                    >
                                        <td className="py-3 px-4 border text-center">
                                            {index + 1}
                                        </td>
                                        <td className="py-3 px-4 border">
                                            {item.deskripsi}
                                        </td>
                                        <td className="py-3 px-4 border text-center">
                                            {item.bobot}
                                        </td>
                                        <td className="py-3 px-4 border text-center">
                                            {item.skor}
                                        </td>
                                        <td className="py-3 px-4 border text-center">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                                    <Pencil size={14} />
                                                </button>
                                                <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal Tambah */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">
                                Tambah Kompetensi
                            </h3>
                            <form
                                onSubmit={handleSubmitKompetensi}
                                className="space-y-3"
                            >
                                <input
                                    type="text"
                                    placeholder="Deskripsi"
                                    value={newKompetensi.deskripsi}
                                    onChange={(e) =>
                                        setNewKompetensi({
                                            ...newKompetensi,
                                            deskripsi: e.target.value,
                                        })
                                    }
                                    className="w-full border px-3 py-2 rounded-lg"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Bobot"
                                    value={newKompetensi.bobot}
                                    onChange={(e) =>
                                        setNewKompetensi({
                                            ...newKompetensi,
                                            bobot: e.target.value,
                                        })
                                    }
                                    className="w-full border px-3 py-2 rounded-lg"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Skor"
                                    value={newKompetensi.skor}
                                    onChange={(e) =>
                                        setNewKompetensi({
                                            ...newKompetensi,
                                            skor: e.target.value,
                                        })
                                    }
                                    className="w-full border px-3 py-2 rounded-lg"
                                    required
                                />

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-left text-gray-400 text-sm mt-16 border-t pt-2">
                    Copyright Porem ipsum dolor sit amet Porem ipsum dolor sit
                    amet
                </div>
            </div>
        </div>
    );
};

export default Kompetensi;
