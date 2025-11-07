import React, { useState } from "react";
import { Eye, EyeOff, User, KeyRound } from "lucide-react";
// 👇 [UBAH] Impor hook yang diperlukan dari Inertia
import { useForm, usePage } from "@inertiajs/react";
import OsModal from "../../components/Modal";

export default function LoginMosaicPage() {
    // 👇 [BARU] Ambil error dari props yang dikirim controller
    const { errors } = usePage().props;

    // State untuk show/hide password tetap sama
    const [showPwd, setShowPwd] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // 👇 [UBAH] Ganti useState dengan useForm untuk data login
    const { data, setData, post, processing } = useForm({
        username: "",
        password: "",
    });

    // 👇 [UBAH] Fungsi onSubmit sekarang mengirim data ke backend
    const onSubmit = (e) => {
        e.preventDefault();
        // Kirim request POST ke URL '/login'
        post("/login");
    };

    return (
        <div className="login-bg min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full bg-white border-black max-w-md border rounded-xl p-8 md:p-8 shadow-md">
                {/* Logo bulat */}
                <div className="mx-auto w-20 h-20 rounded-full bg-blue-300" />

                <h1 className="mt-4 text-center text-2xl font-bold">MOSAIC</h1>
                <p className="text-center text-sm text-slate-600">
                    Website OSCE | Fakultas Kedokteran
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    {/* Username */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <User className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Masukkan username anda..."
                            // 👇 [UBAH] Gunakan data dari useForm
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            className="w-full border border-gray-700 rounded-md py-2 pl-9 pr-3 text-sm placeholder-slate-500 focus:outline-none focus:border-slate-600"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <KeyRound className="w-4 h-4" />
                            </span>
                            <input
                                type={showPwd ? "text" : "password"}
                                placeholder="Masukkan password anda..."
                                // 👇 [UBAH] Gunakan data dari useForm
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-gray-700"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowPwd((v) => !v)}
                            className="w-10 h-10 flex items-center justify-center border rounded-xl bg-gray-900 text-white hover:bg-gray-600"
                        >
                            {showPwd ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    {/* 👇 [BARU] Tampilkan error validasi dari backend */}
                    {errors.username && (
                        <div className="text-red-500 text-xs">
                            {errors.username}
                        </div>
                    )}
                    {errors.password && (
                        <div className="text-red-500 text-xs">
                            {errors.password}
                        </div>
                    )}
                    {usePage().props.flash.error && (
                        <div className="text-red-500 text-xs">
                            {usePage().props.flash.error}
                        </div>
                    )}

                    {/* Tombol Login */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            // 👇 [UBAH] Tambahkan disabled saat loading
                            disabled={processing}
                            className="w-3/5 bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-gray-600 disabled:opacity-50"
                        >
                            {/* 👇 [UBAH] Ganti teks tombol saat loading */}
                            {processing ? "Loading..." : "Login"}
                        </button>
                    </div>

                    {/* Link bantuan */}
                    <div className="text-center text-xs text-blue-600 mt-2">
                        <a
                            href="#"
                            className="underline hover:text-blue-800 transition-colors"
                        >
                            Ada masalah? Hubungi admin.
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
