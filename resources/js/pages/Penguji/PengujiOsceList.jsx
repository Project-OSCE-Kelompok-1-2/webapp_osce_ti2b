import React, { useEffect, useState } from "react";

export default function PengujiOsceList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());

    // Fetch data dari backend
    const fetchData = async () => {
        setLoading(true);
        try {
            const url = `/penguji/osce?search=${encodeURIComponent(
                search
            )}&tahun=${year}`;
            const res = await fetch(url);
            const json = await res.json();
            setData(json.data || []);
        } catch (err) {
            console.error("Fetch error:", err);
        }
        setLoading(false);
    };

    // Auto-fetch saat search atau tahun berubah
    useEffect(() => {
        fetchData();
    }, [search, year]);

    // Data tahun
    const yearOptions = Array.from({ length: 6 }, (_, i) => 2023 + i);

    return (
        <div className="w-full p-4 space-y-4">
            {/* Title */}
            <h2 className="text-xl font-semibold">Jadwal OSCE</h2>

            {/* Filter Section */}
            <div className="flex gap-3 items-center">
                {/* Search Field (ganti dengan komponen SearchBar-mu) */}
                <input
                    type="text"
                    placeholder="Cari data OSCE..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                />

                {/* Dropdown Tahun (ganti dengan Dropdown-mu) */}
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    {yearOptions.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>

                {/* Tombol Cari */}
                <button
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Cari
                </button>
            </div>

            {/* Table (ganti dengan StyledTable-mu) */}
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2 w-12">No</th>
                            <th className="border p-2">Nama OSCE</th>
                            <th className="border p-2">Tanggal Mulai</th>
                            <th className="border p-2">Tanggal Akhir</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    Tidak ada data
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border p-2 text-center">
                                        {index + 1}
                                    </td>

                                    <td className="border p-2">
                                        <div className="font-semibold">
                                            {row.nama}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {row.jumlah_mahasiswa} Mahasiswa |
                                            Sesi {row.sesi}
                                        </div>
                                    </td>

                                    <td className="border p-2">
                                        {row.tanggal_mulai}
                                    </td>
                                    <td className="border p-2">
                                        {row.tanggal_akhir}
                                    </td>

                                    <td className="border p-2">{row.status}</td>

                                    <td className="border p-2">
                                        <button
                                            className="px-3 py-1 rounded text-white"
                                            style={{
                                                background:
                                                    row.buttonColor ||
                                                    "#2563eb",
                                            }}
                                        >
                                            {row.buttonLabel || "Aksi"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination placeholder (nanti bisa kamu buat sesuai gambar) */}
            <div className="flex gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        className="w-6 h-6 border flex items-center justify-center rounded-full hover:bg-gray-200"
                    >
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
}
