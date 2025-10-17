import React, { useState } from "react";

/**
 * WOSCE Login UI – React + TailwindCSS (single file)
 * - Tampilan mengikuti wireframe: card tengah, logo bulat, judul WOSCE, subtitle, input dengan ikon bulat,
 *   toggle show-password di kanan field password, checkbox "Ingat saya", link "lupa password?",
 *   tombol Login, dan link bantuan admin.
 * - Tidak butuh library eksternal selain Tailwind untuk styling.
 */

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        // TODO: hubungkan ke API login.
        alert(`Login as ${username} | remember=${remember}`);
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 flex items-start md:items-center justify-center p-4">
            {/* frame abu-abu seperti wireframe */}
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-slate-300 bg-white shadow-sm px-8 py-8 md:py-10">
                    {/* Logo bulat */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-slate-300" />

                    {/* Heading */}
                    <h1 className="mt-4 text-center text-2xl font-extrabold tracking-tight">
                        WOSCE
                    </h1>
                    <p className="text-center text-sm text-slate-500">
                        Porem ipsum dolor
                    </p>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="mt-8 space-y-4">
                        {/* Username */}
                        <label className="block">
                            <span className="sr-only">Username</span>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                                    <div className="w-4 h-4 rounded-full bg-slate-300" />
                                </div>
                                <input
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className="w-full rounded-md border border-slate-300 bg-white px-10 py-2.5 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500"
                                />
                            </div>
                        </label>

                        {/* Password + toggle show */}
                        <label className="block">
                            <span className="sr-only">Password</span>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                                    <div className="w-4 h-4 rounded-full bg-slate-300" />
                                </div>
                                <input
                                    type={showPwd ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full rounded-md border border-slate-300 bg-white px-10 py-2.5 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500 pr-14"
                                />
                                {/* toggle kotak bundar di kanan (meniru switch di wireframe) */}
                                <button
                                    type="button"
                                    aria-label="Tampilkan password"
                                    onClick={() => setShowPwd((v) => !v)}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg border ${
                                        showPwd ? "bg-slate-900" : "bg-white"
                                    } flex items-center justify-center`}
                                >
                                    <span
                                        className={`block h-4 w-4 rounded-full ${
                                            showPwd
                                                ? "bg-white"
                                                : "bg-slate-300"
                                        }`}
                                    />
                                </button>
                            </div>
                        </label>

                        {/* Ingat saya + lupa password */}
                        <div className="flex items-center justify-between text-xs">
                            <label className="inline-flex items-center gap-2 select-none">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) =>
                                        setRemember(e.target.checked)
                                    }
                                    className="h-3.5 w-3.5 accent-slate-700"
                                />
                                <span>Ingat saya</span>
                            </label>
                            <a
                                href="#"
                                className="text-slate-500 hover:text-slate-700 underline"
                            >
                                lupa password?
                            </a>
                        </div>

                        {/* Button Login */}
                        <button
                            type="submit"
                            className="mt-2 w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 active:scale-[.99]"
                        >
                            Login
                        </button>
                    </form>

                    {/* Bantuan admin */}
                    <div className="mt-3 text-center text-[11px]">
                        Ada masalah?{" "}
                        <a href="#" className="underline">
                            hubungi admin
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
