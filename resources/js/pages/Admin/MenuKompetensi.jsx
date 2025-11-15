import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { Pencil, Trash2, PlusCircle, Search, ArrowLeft } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import OsIcon from "../../components/icons";
import OsTableHeader from "../../components/tableheader";
import OsSearchBar from "../../components/searchbar";
import OsPagination from "../../components/pagination.jsx";
import OsTableBody from "../../components/tablecontain.jsx";


//Definisi kolom tabel 
const columns = [
    { content: "No", width: "w-16", classes: "justify-center", key: "no" },
    { content: "Deskripsi Kompetensi", width: "flex-1", classes: "justify-start px-4", key: "kompetensi" },
    { content: "Bobot", width: "w-20", classes: "justify-center", key: "bobot" },
    { content: "Action", width: "w-28", classes: "justify-center", key: "action" }
];


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

    // 6. Fungsi untuk siapin data isi tabel
    const tableData = kompetensi.data.map((item, idx) => ({
        no: kompetensi.from + idx,
        kompetensi: item.kompetensi,
        bobot: item.bobot,
        action: (
            <div className="flex gap-2 justify-center">
                <button
                    onClick={() =>
                        router.get(`/admin/kompetensi/${item.id_poin_aspek_penilaian}/edit`)
                    }
                    className="p-1.5 text-white bg-blue-700 hover:bg-blue-500 border border-black rounded-lg"
                >
                    <Pencil size={16} />
                </button>
    
                <button
                    onClick={() => handleDelete(item.id_poin_aspek_penilaian)}
                    className="p-1.5 text-black bg-white hover:bg-red-600 hover:text-white border border-black rounded-lg"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        )
    }));
    

    return (
        // 🆕 Tambahkan relative dan overflow-hidden agar sidebar overlay bisa muncul di atas dashboard
        <div className="relative bg-os-white w-full min-h-screen  flex justify-start p-os-12 font-sans overflow-hidden">
            {/* Sidebar dipanggil langsung tanpa kontrol dari dashboard */}
            <Sidebar />

            <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
            {/* Breadcrumb */}
            <OsHeader variant="goback" backLink={`/admin/stase/${aspek.stase.id_stase}/aspek-penilaian`}/>

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
                <OsSearchBar
                    search={search}
                    setSearch={setSearch}
                    onSearchClick={handleSearch}
                    placeholder="Cari kompetensi..."
                />

                {/* Tabel Kompetensi */}
                <h3 className="font-semibold mb-2">Table Kompetensi</h3>

                <OsTableHeader columns={columns} />

                <OsTableBody data={tableData} columns={columns} />


                {/* PAGINATION */}
                <OsPagination links={kompetensi.links} />


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
