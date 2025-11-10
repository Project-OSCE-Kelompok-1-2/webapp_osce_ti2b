import React, { useState } from "react";
// 👇 [UBAH] Impor hook dan komponen yang diperlukan dari Inertia
import { usePage, Link, router } from "@inertiajs/react";
import { Pencil, Trash2, PlusCircle, Search, ArrowLeft } from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function KompetensiPage() {
    // 1. Ambil data dari props yang dikirim Controller
    const { aspek, kompetensi, filters } = usePage().props;

    // 2. Siapkan state untuk input pencarian
    const [search, setSearch] = useState(filters.search || "");

    // 3. Fungsi untuk menjalankan pencarian
    const handleSearch = () => {
        router.get(
            `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi`,
            { search },
            { preserveState: true, replace: true }
        );
    };

    // 4. Fungsi untuk menghapus data
    const handleDelete = (kompetensiId) => {
        if (confirm("Apakah Anda yakin ingin menghapus kompetensi ini?")) {
            router.delete(`/admin/kompetensi/${kompetensiId}`, {
                preserveScroll: true,
            });
        }
    };

    // 5. Hitung total bobot dari data yang diterima dari database
    const totalBobot = kompetensi.data.reduce(
        (acc, curr) => acc + Number(curr.bobot),
        0
    );

    return (
        // 🆕 Tambahkan relative dan overflow-hidden agar sidebar overlay bisa muncul di atas dashboard
        <div className="relative bg-os-white w-full min-h-screen  flex justify-start p-os-12 font-sans overflow-hidden">

            {/* Sidebar dipanggil langsung tanpa kontrol dari dashboard */}
            <Sidebar/>

            <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-6 bg-white">
                {/* 👇 [UBAH] Tombol kembali menjadi Link */}
                <Link
                    href={`/admin/stase/${aspek.stase.id_stase}/aspek-penilaian`}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl border border-black"
                >
                    <ArrowLeft size={20} />
                </Link>

                <div className="flex-1 mx-3 border border-black rounded-xl px-4 py-2 bg-white">
                    {/* 👇 [UBAH] Breadcrumb dibuat dinamis */}
                    <p className="text-black text-lg truncate">
                        {aspek.stase.nama_stase} / {aspek.aspek} / Kompetensi
                    </p>
                </div>
            </div>

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-medium text-black mb-1">
                    Menu Kompetensi
                </h2>
                <p className="text-sm text-gray-500 max-w-md">
                    Halaman untuk mengelola poin-poin kompetensi dari aspek
                    penilaian "{aspek.aspek}"
                </p>

                {/* 👇 [UBAH] Tombol tambah diubah menjadi Link */}
                <button
                    onClick={() =>
                        router.get(
                            `/admin/aspek-penilaian/${aspek.id_aspek_penilaian}/kompetensi/create`
                        )
                    }
                    className="flex items-center gap-2 mt-3 bg-blue-700 hover:bg-blue-600 text-white px-5 py-3 rounded-xl"
                >
                    <PlusCircle size={20} />
                    Tambah Kompetensi
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex flex-1 items-center gap-2 border border-black rounded-xl px-3 py-3">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Tuliskan data kompetensi..."
                        className="flex-1 outline-none text-sm text-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="px-24 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl border border-black"
                >
                    Cari
                </button>
            </div>

            {/* Tabel Kompetensi */}
            <h3 className="font-semibold mb-2">Table Kompetensi</h3>
            <div className="relative overflow-x-auto border border-black rounded-xl shadow-sm">
                <table className="w-full text-sm border-collapse">
                    {/* ======= HEADER (Tidak diubah) ======= */}
                    <thead className="bg-gray-200 text-black border-b border-black">
                        <tr>
                            <th className="border-b border-black py-2 px-3 text-center w-12">
                                No
                            </th>
                            <th className="border-x border-b border-black py-2 px-3 text-left">
                                Deskripsi Kompetensi
                            </th>
                            <th className="border-r border-b border-black py-2 px-3 text-center w-24">
                                Bobot
                            </th>
                            <th className="border-b border-black py-2 px-3 text-center w-28">
                                Action
                            </th>
                        </tr>
                    </thead>

                    {/* 👇 [UBAH] Body tabel sekarang dinamis */}
                    <tbody>
                        {kompetensi.data.length > 0 ? (
                            kompetensi.data.map((item, idx) => (
                                <tr
                                    key={item.id_poin_aspek_penilaian}
                                    className="hover:bg-gray-50 transition border-t border-black/30"
                                >
                                    <td className="border-r border-black/30 text-center py-2">
                                        {kompetensi.from + idx}
                                    </td>
                                    <td className="border-r border-black/30 py-2 px-3 text-gray-800">
                                        {item.kompetensi}
                                    </td>
                                    <td className="border-r border-black/30 text-center py-2">
                                        {item.bobot}
                                    </td>
                                    <td className="py-2 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => {
                                                // [BENAR] Arahkan ke route 'edit' yang sesuai route:resource
                                                router.get(
                                                    `/admin/kompetensi/${item.id_poin_aspek_penilaian}/edit`
                                                );
                                            }}
                                            className="p-1.5 text-white bg-blue-700 hover:bg-blue-500 border border-black rounded-lg"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    item.id_poin_aspek_penilaian
                                                )
                                            }
                                            className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white border border-black rounded-lg transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center text-gray-500 py-4 border-t border-black/30"
                                >
                                    Data tidak ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION (Untuk sementara dihapus agar tidak error, bisa diganti dengan komponen Paginasi nanti) */}

            {/* Footer Total Kompetensi / Aspek Penilaian */}
            <div className="relative mt-12 my-6 border border-black rounded-xl flex items-center justify-between px-4 py-2">
                <p className="text-sm text-black">
                    Total bobot kompetensi / aspek penilaian
                </p>
                <div className="flex gap-3">
                    <div className="border border-black rounded-xl px-8 py-2">
                        <span className="font-medium">Kompetensi:</span>{" "}
                        {kompetensi.total}{" "}
                        {/* [UBAH] Gunakan total dari paginator */}
                    </div>
                    <div className="border border-black rounded-xl px-8 py-2">
                        <span className="font-medium">Total Bobot:</span>{" "}
                        {totalBobot}
                    </div>
                </div>
            </div>

            {/* Footer Copyright */}
            <footer className="border border-black rounded-xl text-start px-4 py-4 text-sm text-gray-600">
                © Jorem ipsum dolor sit amet, consectetur adipiscing elit.
            </footer>
        </div>
    </div>
    );
}
