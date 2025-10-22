import React, { useState } from "react";
import { Eye, EyeOff, User, KeyRound } from "lucide-react";
import { router } from "@inertiajs/react";

export default function LoginMosaicPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        if (username === "admin" && password === "12345") {
            router.visit("/admin/dashboard");
        } else {
            alert("Username atau password salah!");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md border rounded-xl p-6 md:p-8 shadow-md">
                {/* Logo bulat */}
                <div className="mx-auto w-20 h-20 rounded-full bg-slate-300" />

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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-slate-400 rounded-md py-2 pl-9 pr-3 text-sm placeholder-slate-500 focus:outline-none focus:border-slate-600"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:border-gray-700"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowPwd((v) => !v)}
                            className="w-10 h-10 flex items-center justify-center border rounded-md bg-gray-900 text-white hover:bg-gray-600"
                        >
                            {showPwd ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    {/* Tombol Login */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-3/5 bg-black text-white py-2 rounded-md text-sm font-semibold hover:bg-gray-600"
                        >
                            Login
                        </button>
                    </div>

                    {/* Link bantuan */}
                    <div className="text-center text-xs text-slate-600 mt-2">
                        <a
                            href="#"
                            className="underline hover:text-slate-800 transition-colors"
                        >
                            Ada masalah? Hubungi admin.
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
