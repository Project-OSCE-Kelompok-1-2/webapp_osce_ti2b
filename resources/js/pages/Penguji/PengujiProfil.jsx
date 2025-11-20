import React, { useState, useEffect } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import {
    Lock,
    Eye,
    EyeOff,
    UploadCloud,
    Trash2,
    AlertCircle,
    ArrowLeft,
    Save,
} from "lucide-react";

// GANTI SIDEBAR KE VERSI PENGUJI
import SidebarPenguji from "../../components/SidebarPenguji.jsx";

import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import Os_input from "../../components/Input.jsx";
import OsIcon from "../../components/icons.jsx";
import OsButton from "../../components/button.jsx";

export default function PengujiProfil({ user = {} }) {
    const { errors } = usePage().props;

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const { data, setData, post, processing, wasSuccessful, reset } = useForm({
        username: user.username || "",
        email: user.email || "",
        alamat: user.alamat || "",
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

    const handleLogout = () => {
        post("/logout");
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            {/* GUNAKAN SIDEBAR PENGUJI */}
            <SidebarPenguji />

            <div className="bg-gray-100 w-full min-h-screen flex justify-center p-6 font-sans md:ml-20 transition-all duration-300">
                <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14">
                    {/* HEADER */}
                    <OsHeader variant="goback" backLink="/penguji/dashboard" />

                    {/* MAIN CONTENT */}
                    <main className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col lg:flex-row items-start gap-5 relative w-full">
                            {/* PROFILE IMAGE */}
                            <aside className="flex flex-col w-full lg:w-[403px] items-center gap-[17px] p-5 bg-white rounded-xl border border-black shadow-sm">
                                <h2 className="text-xl font-normal">
                                    Gambar Profil
                                </h2>
                                <hr className="w-full border-black" />

                                <div
                                    className="w-[177px] h-[177px] rounded-full border border-black bg-cover bg-center"
                                    style={
                                        profileImage
                                            ? {
                                                  backgroundImage: `url(${profileImage})`,
                                              }
                                            : {}
                                    }
                                />

                                <div className="p-3.5 w-full bg-red-300 rounded-xl border border-black">
                                    <div className="flex items-center gap-2">
                                        <OsIcon
                                            name="Warning"
                                            className="text-red-500 w-4 h-4"
                                        />
                                        <span className="text-black font-medium">
                                            Perhatian!
                                        </span>
                                    </div>
                                    <p className="text-black text-sm mt-1">
                                        Gambar yang dikirim harus berukuran
                                        kurang lebih dari 1 MB dengan resolusi
                                        max 500x500 px. Format foto: .png,
                                        .jpeg, .jpg, .gif
                                    </p>
                                </div>

                                {errors.foto && (
                                    <p className="text-sm text-red-500">
                                        {errors.foto}
                                    </p>
                                )}

                                <div className="flex items-center w-full gap-4">
                                    <label className="flex items-center justify-center px-3 py-3 flex-1 bg-blue-600 text-white rounded-xl cursor-pointer">
                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg,.gif"
                                            onChange={handleProfileImageUpload}
                                            className="sr-only"
                                        />
                                        <OsIcon
                                            name="Upload"
                                            className="h-os-20 os-icon-light"
                                        />
                                        <span className="ml-2">
                                            Upload gambar profil
                                        </span>
                                    </label>

                                    <OsButton
                                        type="button"
                                        onClick={handleDeleteProfileImage}
                                        className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center"
                                    >
                                        <OsIcon
                                            name="Trash"
                                            className="h-os-20 os-icon-light"
                                        />
                                    </OsButton>
                                </div>
                            </aside>

                            {/* FORM ACCOUNT */}
                            <section className="flex flex-col p-5 bg-white rounded-xl border border-black shadow-sm flex-1">
                                <h2 className="text-xl font-normal">Akun</h2>
                                <hr className="w-full border-black mb-4" />

                                <form
                                    onSubmit={handleSave}
                                    className="flex flex-col gap-5 w-full"
                                >
                                    <Os_input
                                        type="text"
                                        label="Nama pengguna"
                                        name="username"
                                        disabled
                                        value={data.username}
                                        onChange={(e) =>
                                            setData("username", e.target.value)
                                        }
                                    />

                                    {/* Alamat */}
                                    <Os_input
                                        type="text"
                                        label="Alamat pengguna"
                                        name="alamat"
                                        placeholder="Masukkan alamat pengguna..."
                                        value={data.alamat}
                                        onChange={(e) =>
                                            setData("alamat", e.target.value)
                                        }
                                    />

                                    {/* Email */}
                                    <Os_input
                                        type="email"
                                        label="Email pengguna"
                                        name="email"
                                        disabled
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        icon={
                                            <OsIcon
                                                name="Mail"
                                                className="w-5 h-5"
                                            />
                                        }
                                    />

                                    {/* Password lama */}
                                    <Os_input
                                        type={
                                            showOldPassword
                                                ? "text"
                                                : "password"
                                        }
                                        label="Password lama"
                                        name="old_password"
                                        placeholder="Masukkan password lama..."
                                        value={data.old_password}
                                        onChange={(e) =>
                                            setData(
                                                "old_password",
                                                e.target.value
                                            )
                                        }
                                        iconRight={
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowOldPassword(
                                                        (v) => !v
                                                    )
                                                }
                                            >
                                                {showOldPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        }
                                    />
                                    {errors.old_password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.old_password}
                                        </p>
                                    )}

                                    {/* Password baru + konfirmasi */}
                                    <div className="flex flex-col lg:flex-row gap-5 w-full">
                                        <Os_input
                                            className="flex-1"
                                            type="password"
                                            label="Password baru"
                                            name="new_password"
                                            placeholder="Masukkan password baru..."
                                            value={data.new_password}
                                            onChange={(e) =>
                                                setData(
                                                    "new_password",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <Os_input
                                            className="flex-1"
                                            type="password"
                                            label="Konfirmasi password baru"
                                            name="new_password_confirmation"
                                            placeholder="Konfirmasi password..."
                                            value={
                                                data.new_password_confirmation
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "new_password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <OsButton
                                            name="primary"
                                            className="flex items-center justify-center w-[223px] gap-2 border border-black"
                                            onClick={handleSave}
                                        >
                                            <OsIcon
                                                name="Save"
                                                className="h-os-20 os-icon-light"
                                            />
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan"}
                                        </OsButton>

                                        <OsButton
                                            name="warning"
                                            className="flex items-center justify-center w-[223px] gap-2 border border-black bg-red-600"
                                            onClick={handleLogout}
                                        >
                                            <OsIcon
                                                name="Logout"
                                                className="h-os-20 os-icon-light"
                                            />
                                            Logout
                                        </OsButton>
                                    </div>

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

                    {/* FOOTER */}
                    <OsCopyright />
                </div>
            </div>
        </div>
    );
}
