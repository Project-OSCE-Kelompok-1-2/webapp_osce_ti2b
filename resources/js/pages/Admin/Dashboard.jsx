import React from "react";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard() {
    // ==============================
    // PERBAIKAN: Tambah "user"
    // ==============================
    const {
        stats = { total_osce: 0, total_mahasiswa: 0, total_penguji: 0 },
        notifikasi = [],
        user = null,
    } = usePage().props || {};

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="p-6 space-y-6">

                {/* Header User */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user?.username ?? "USERNAME"}
                        </h1>
                        <p className="text-gray-500">
                            {user?.email ?? "email@example.com"}
                        </p>
                    </div>
                </div>

                {/* Statistik OSCE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-white shadow">
                        <p className="text-gray-500">Total OSCE</p>
                        <h2 className="text-2xl font-bold">{stats.total_osce}</h2>
                    </div>

                    <div className="p-4 rounded-xl bg-white shadow">
                        <p className="text-gray-500">Total Mahasiswa</p>
                        <h2 className="text-2xl font-bold">{stats.total_mahasiswa}</h2>
                    </div>

                    <div className="p-4 rounded-xl bg-white shadow">
                        <p className="text-gray-500">Total Penguji</p>
                        <h2 className="text-2xl font-bold">{stats.total_penguji}</h2>
                    </div>
                </div>

                {/* Notifikasi / Reminder */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-3">Notifikasi</h3>
                    <ul className="space-y-2">
                        {notifikasi.length === 0 && (
                            <p className="text-gray-500">Tidak ada notifikasi.</p>
                        )}

                        {notifikasi.map((item, index) => (
                            <li key={index} className="text-gray-700">
                                • {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
