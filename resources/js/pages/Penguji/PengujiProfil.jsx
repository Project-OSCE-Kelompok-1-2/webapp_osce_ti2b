import React, { useState, useEffect } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    UploadCloud,
    Trash2,
    AlertCircle,
    LogOut,
    ArrowLeft,
    Save,
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";

export default function PengujiProfil({ user }) {
    const { errors } = usePage().props;

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const { data, setData, post, processing, wasSuccessful, reset } = useForm({
        username: user.username || "",
        email: user.email || "",
        foto: null,
        delete_foto: false,
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    useEffect(() => {
        if (user.path_gambar) {
            setProfileImage(`/${user.path_gambar}`);
        } else {
            setProfileImage("https://via.placeholder.com/177?text=U");
        }
    }, [user.path_gambar]);

    useEffect(() => {
        if (wasSuccessful) {
            reset("old_password", "new_password", "new_password_confirmation");
        }
    }, [wasSuccessful]);

    const handleProfileImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setData({ ...data, foto: file, delete_foto: false });
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleDeleteProfileImage = () => {
        setData({ ...data, foto: null, delete_foto: true });
        setProfileImage("https://via.placeholder.com/177?text=U");
    };

    const handleSave = (e) => {
        e.preventDefault();
        post("/penguji/profil/update", { preserveScroll: true });
    };

    const customColors = { primary: "#3B82F6" };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <div className="bg-gray-100 w-full min-h-screen flex justify-center p-6 font-sans">
                <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">

                    {/* ====================== HEADER ====================== */}
                    <header className="relative w-full flex flex-col gap-5 bg-white p-4 rounded-xl shadow-sm border border-gray-900">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/penguji/dashboard"
                                className="flex w-[54px] h-[54px] items-center justify-center bg-blue-600 text-white rounded-xl border border-black"
                                aria-label="Back"
                                as="button"
                            >
                                <ArrowLeft className="w-[30px] h-[26px]" />
                            </Link>

                            <div className="flex-1 h-[54px] bg-white rounded-xl overflow-hidden border border-black flex items-center px-5">
                                <p className="text-xl">
                                    <span className="text-black/70">Pengaturan</span>
                                    <span className="text-black"> / Akun</span>
                                </p>
                            </div>
                        </div>
                        <hr className="border-black" />
                    </header>

                    {/* ====================== MAIN CONTENT ====================== */}
                    <main className="flex flex-col gap-5 w-full">

                        <div className="flex flex-col lg:flex-row gap-5 w-full">

                            {/* ====================== PROFILE IMAGE ====================== */}
                            <aside className="flex flex-col w-full lg:w-[403px] items-center gap-[17px] p-5 bg-white rounded-xl border border-black shadow-sm">

                                <div className="w-full">
                                    <h2 className="text-xl">Gambar Profil</h2>
                                    <hr className="border-black mt-1" />
                                </div>

                                <div
                                    className="w-[177px] h-[177px] rounded-full border border-black bg-cover bg-center"
                                    style={
                                        profileImage
                                            ? { backgroundImage: `url(${profileImage})` }
                                            : {}
                                    }
                                />

                                {/* Warning */}
                                <div className="p-3.5 w-full bg-red-100 rounded-xl border border-red-400">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="text-red-500 w-4 h-4" />
                                        <span className="text-red-800 font-medium">Perhatian!</span>
                                    </div>
                                    <p className="text-red-700 text-sm mt-1">
                                        Gambar harus <b>&lt; 1MB</b>, max resolusi <b>500×500</b>, format
                                        <b> .png, .jpeg, .jpg, .gif</b>.
                                    </p>
                                </div>

                                {errors.foto && (
                                    <p className="text-sm text-red-500">{errors.foto}</p>
                                )}

                                <div className="flex items-center w-full gap-4">
                                    <label className="flex items-center justify-center px-3 py-3 flex-1 bg-blue-600 text-white rounded-xl cursor-pointer">
                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg,.gif"
                                            onChange={handleProfileImageUpload}
                                            className="sr-only"
                                        />
                                        <UploadCloud className="w-5 h-5" />
                                        <span className="ml-2">Upload gambar profil</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleDeleteProfileImage}
                                        className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </aside>

                            {/* ====================== FORM ACCOUNT ====================== */}
                            <section className="flex flex-col gap-[15px] p-5 bg-white rounded-xl border border-black shadow-sm w-full">

                                <div className="w-full">
                                    <h2 className="text-xl">Akun</h2>
                                    <hr className="border-black mt-1" />
                                </div>

                                <form
                                    onSubmit={handleSave}
                                    className="flex flex-col gap-5 w-full"
                                >
                                    {/* Username */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs">Nama pengguna</label>
                                        <div className="flex items-center p-3 border border-black rounded-xl">
                                            <User className="w-4 h-4 opacity-50" />
                                            <input
                                                disabled
                                                type="text"
                                                value={data.username}
                                                className="flex-1 ml-3 bg-transparent outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs">Email pengguna</label>
                                        <div className="flex items-center p-3 border border-black rounded-xl bg-gray-100">
                                            <Mail className="w-4 h-4 opacity-50" />
                                            <input
                                                disabled
                                                type="email"
                                                value={data.email}
                                                className="flex-1 ml-3 bg-transparent outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Password lama */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs">Password lama</label>

                                        <div className="flex items-center p-3 border border-black rounded-xl">
                                            <Lock className="w-4 h-4" />
                                            <input
                                                type={showOldPassword ? "text" : "password"}
                                                placeholder="Masukkan password lama..."
                                                value={data.old_password}
                                                onChange={(e) =>
                                                    setData("old_password", e.target.value)
                                                }
                                                className="flex-1 ml-3 outline-none"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowOldPassword((v) => !v)
                                                }
                                            >
                                                {showOldPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>

                                        {errors.old_password && (
                                            <p className="text-red-500 text-sm">
                                                {errors.old_password}
                                            </p>
                                        )}
                                    </div>

                                    {/* New + confirm password */}
                                    <div className="flex flex-col lg:flex-row gap-5 w-full">

                                        <div className="flex flex-col gap-1 w-full">
                                            <label className="text-xs">Password baru</label>
                                            <div className="flex items-center p-3 border border-black rounded-xl">
                                                <Lock className="w-4 h-4" />
                                                <input
                                                    type="password"
                                                    placeholder="Masukkan password baru..."
                                                    value={data.new_password}
                                                    onChange={(e) =>
                                                        setData("new_password", e.target.value)
                                                    }
                                                    className="flex-1 ml-3 outline-none"
                                                />
                                            </div>
                                            {errors.new_password && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.new_password}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1 w-full">
                                            <label className="text-xs">
                                                Konfirmasi password baru
                                            </label>
                                            <div className="flex items-center p-3 border border-black rounded-xl">
                                                <Lock className="w-4 h-4" />
                                                <input
                                                    type="password"
                                                    placeholder="Konfirmasi password baru..."
                                                    value={data.new_password_confirmation}
                                                    onChange={(e) =>
                                                        setData(
                                                            "new_password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 ml-3 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tombol Simpan */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center justify-center w-[223px] bg-blue-600 text-white p-3 rounded-xl border border-black gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        {processing ? "Menyimpan..." : "Simpan"}
                                    </button>

                                    <a
                                        href="#contact-admin"
                                        className="text-xs underline text-black"
                                    >
                                        Ada masalah? Hubungi admin
                                    </a>
                                </form>
                            </section>
                        </div>
                    </main>

                    {/* ====================== FOOTER ====================== */}
                    <footer className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-900 flex justify-between text-gray-500">
                        © 2025 All rights reserved. | Polines
                    </footer>
                </div>
            </div>
        </div>
    );
}
