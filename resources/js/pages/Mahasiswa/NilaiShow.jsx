    import React, { useState } from "react";
    import { Head, Link } from "@inertiajs/react";
    import { FileText, Table2, Users } from "lucide-react";

    // =========================================
    // --- IMPORT KOMPONEN CUSTOM (MODULAR) ---
    // =========================================
    import Sidebar from "../../components/Sidebar"; 
    import OsHeader from "../../components/Header";
    import OsTableHeader from "../../components/tableheader";
    import OsTableBody from "../../components/tablecontain";
    import OsCopyright from "../../components/copyright";

    // =========================================
    // --- KOMPONEN UTAMA HALAMAN ---
    // =========================================
    export default function NilaiShow({ header_detail, daftar_nilai, footer }) {
        const [isSidebarOpen, setIsSidebarOpen] = useState(false);

        const data = {
            mahasiswa: {
                nama: header_detail?.mahasiswa?.nama || "-",
                nim: header_detail?.mahasiswa?.nim || "-",
                prodi: header_detail?.mahasiswa?.prodi || "-",
                semester: header_detail?.tahun_akademik?.semester || "-",
            },
            ujian: {
                nama_osce: header_detail?.mata_kuliah?.nama || "-",
                tahun: header_detail?.tahun_akademik?.tahun || "-",
            },
            daftarNilai: daftar_nilai || [],

            totalNilai: footer?.total_nilai_akhir ?? "0",
            statusKelulusan: footer?.status_kelulusan || "BELUM LENGKAP",
        };

        const tableColumns = [
            {
                key: "id",
                content: "No",
                width: "w-[40px] md:w-[80px]",
                classes: "justify-center items-center",
            },
            {
                key: "nama_stase",
                content: (
                    <>
                        <span className="hidden md:inline">Nama Stase</span>
                        <span className="md:hidden">Stase</span>
                    </>
                ),
                width: "flex-1",
                classes:
                    "justify-center md:justify-start items-center px-2 md:px-6 text-center md:text-left",
            },
            {
                key: "nilai",
                content: "Nilai",
                width: "w-[60px] md:w-[150px]",
                classes: "justify-center items-center",
            },
            {
                key: "keterangan",
                content: (
                    <>
                        <span className="hidden md:inline">Keterangan</span>
                        <span className="md:hidden">Ket.</span>
                    </>
                ),
                width: "w-[100px] md:w-[200px]",
                classes:
                    "justify-center items-center px-2 md:px-6 tracking-wide",
            },
        ];

        const headerColumns = tableColumns.map((col) => {
            if (col.key === "nama_stase") {
                return {
                    ...col,
                    classes: col.classes
                        .replace("md:justify-start", "md:justify-center")
                        .replace("md:text-left", "md:text-center"),
                };
            }
            return col;
        });

        const InfoRow = ({ label, value }) => (
            <div className="grid grid-cols-12 mb-2">
                <span className="col-span-4 font-normal text-blue-100/90 text-sm">
                    {label}
                </span>
                <span className="col-span-8 font-semibold text-white text-sm break-words">
                    : {value}
                </span>
            </div>
        );

        // =========================================
        // --- RENDER TAMPILAN (JSX) ---
        // =========================================
        return (
            <div className="relative bg-blue-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
                {/* <Head title="Hasil Penilaian OSCE" /> */}

                {/* SIDEBAR */}
                <Sidebar
                    type="mahasiswa"
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <main className="w-full p-os-16 lg:p-4 min-h-screen flex flex-col justify-between gap-os-8 transition-all duration-300 lg:ml-20">
                    <div className="flex flex-col gap-os-8">
                        {/* HEADER */}
                        <OsHeader
                            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            variant="goback"
                            role="mahasiswa"
                            backLink="/mahasiswa/nilai"
                        />

                        {/* KONTEN UTAMA */}
                        <div className="flex-1 overflow-auto p-1">
                            {/* 1. JUDUL HALAMAN */}
                            <div className="flex gap-1 items-center justify-start my-2">
                                <FileText size={18} />
                                <h2 className="font-semibold text-lg">
                                    Hasil Penilaian OSCE
                                </h2>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 max-w-2xl text-justify">
                                Halaman ini menampilkan detail hasil penilaian OSCE
                                berdasarkan stase yang telah diselesaikan.
                            </p>

                            {/* 2. KARTU INFORMASI (BIRU) - Desain Baru */}
                            <div className="w-full bg-green-600 rounded-xl p-6 mb-2">
                                <div className="flex gap-1 items-center justify-start text-white mb-2">
                                    <Users size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4 border-b border-green-500 pb-2">
                                    Detail Mahasiswa & Ujian
                                </h3>
                                {/* Layout 2 kolom untuk layar medium ke atas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-2">
                                    {/* Kiri (Detail Mahasiswa) */}
                                    <div className="space-y-1">
                                        <InfoRow
                                            label="Nama"
                                            value={data.mahasiswa.nama}
                                        />
                                        <InfoRow
                                            label="NIM"
                                            value={data.mahasiswa.nim}
                                        />
                                        <InfoRow
                                            label="Program Studi"
                                            value={data.mahasiswa.prodi}
                                        />
                                    </div>

                                    {/* Kanan (Detail Ujian) */}
                                    <div className="space-y-1 mt-4 md:mt-0">
                                        <InfoRow
                                            label="Semester"
                                            value={data.mahasiswa.semester}
                                        />
                                        <InfoRow
                                            label="Tahun Ujian"
                                            value={data.ujian.tahun}
                                        />
                                        <InfoRow
                                            label="Nama OSCE"
                                            value={data.ujian.nama_osce}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-1 items-center justify-start">
                                <Table2 size={18} />
                                <h2 className="font-semibold text-lg">
                                    Table Penilaian Stase
                                </h2>
                            </div>

                            {/* 3. TABEL NILAI */}
                            <div className="mt-2 bg-white p-5 border border-os-primary-mhs overflow-x-auto rounded-xl shadow-sm">
                                <div className="overflow-x-auto">
                                    <div className="min-w-full">
                                        <div className="bg-white">
                                            <OsTableHeader
                                                columns={headerColumns}
                                                variant="mahasiswa"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <OsTableBody
                                                data={data.daftarNilai}
                                                columns={tableColumns}
                                                variant="mahasiswa"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. FOOTER NILAI (TOTAL & STATUS) */}
                            <div className="w-full flex flex-col gap-4 mt-4">
                                <div className="w-full flex flex-col sm:flex-row bg-white rounded-xl border border-os-primary-mhs h-auto sm:h-[60px] overflow-hidden items-center shadow-lg">
                                    {/* Label */}
                                    <div className="w-full sm:flex-1 h-[50px] sm:h-full flex items-center justify-center sm:justify-start text-black border-b sm:border-b-0 sm:border-r border-green-400 bg-gray-50 sm:bg-white px-4 text-center">
                                        Total / Rata - rata
                                    </div>
                                    {/* Angka Nilai */}
                                    <div className="w-full sm:w-[150px] h-[50px] sm:h-full flex items-center justify-center font-extrabold text-sml text-green-600 border-b sm:border-b-0 sm:border-r border-gray-200">
                                        {data.totalNilai}
                                    </div>
                                    {/* Status (Conditional Styling) */}
                                    <div
                                        className={`w-full sm:w-[220px] h-[50px] sm:h-full flex items-center justify-center font-extrabold text-sm  uppercase tracking-wide px-4 ${
                                            data.statusKelulusan === "LULUS"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700" 
                                        }`}
                                    >
                                        {data.statusKelulusan}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COPYRIGHT */}
                    <div className="">
                        <OsCopyright variant="mahasiswa" />
                    </div>
                </main>
            </div>
        );
    }
