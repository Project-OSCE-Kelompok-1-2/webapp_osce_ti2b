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
    BookUser,
    LogIn,
    ArrowLeft,
    Save,
} from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import OsHeader from "../../components/Header.jsx";
import Modals from "../../components/Modals.jsx"; // 🆕 Tambahkan ini

const Component1 = ({ className }) => <Eye className={className} />;
const Icon1 = ({ className }) => <Save className={className} />;
const IconComponentNode = ({ className }) => <Lock className={className} />;

export default function AdminSettingAkun({ user }) {
    const { errors } = usePage().props;
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    //  ⭐ MODAL STATE
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
            setProfileImage(
                "https://via.placeholder.com/177/3a2323/FFFFFF?text=P"
            );
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

    // ⭐ BUKA MODAL HAPUS FOTO
    const openDeletePhotoModal = () => {
        setIsDeleteModalOpen(true);
    };

    // ⭐ KONFIRMASI HAPUS FOTO
    const confirmDeletePhoto = () => {
        setData({ ...data, foto: null, delete_foto: true });
        setProfileImage("https://via.placeholder.com/177/3a2323/FFFFFF?text=P");
        setIsDeleteModalOpen(false);
    };

    const handleSaveChanges = (event) => {
        event.preventDefault();
        post("/admin/pengaturan-akun", {
            preserveScroll: true,
        });
    };

    const navigationButtons = [
        {
            id: "account-page",
            label: "Halaman Akun",
            icon: (
                <BookUser
                    className="!relative !w-[21px] !h-[21px]"
                    color="white"
                />
            ),
            bgColor: "bg-blue-600",
        },
        {
            id: "login-page",
            label: "Halaman Login",
            icon: <LogIn className="relative w-[19px] h-[21px]" color="white" />,
            bgColor: "bg-blue-600",
            opacity: "opacity-75",
        },
    ];

    const customColors = { primary: "#3B82F6" };

    // ============================
    // RETURN (FULL UI)
    // ============================

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar />

            <div className="bg-gray-100 w-full min-h-screen flex justify-center p-6 font-sans">
                <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14 transition-all duration-300 md:ml-20">
                    {/* HEADER */}
                    <header className="relative row-[1_/_2] col-[1_/_2] w-full flex flex-col items-start gap-5 bg-white p-4 rounded-xl shadow-sm border border-gray-900">
                        <div className="flex items-center justify-between relative self-stretch w-full">
                            <button
                                type="button"
                                className="flex w-[54px] h-[54px] items-center justify-center p-3 relative bg-blue-600 text-white rounded-xl border border-solid border-black"
                            >
                                <ArrowLeft className="relative w-[30px] h-[26px]" />
                            </button>
                            <nav className="relative flex-1 h-[54px] ml-4">
                                <div className="h-full items-center bg-white flex rounded-xl border border-black">
                                    <p className="ml-5 text-xl">
                                        <span className="text-black/70">
                                            Pengaturan
                                        </span>{" "}
                                        / Akun
                                    </p>
                                </div>
                            </nav>
                        </div>
                        <hr className="w-full border-black border-t" />
                    </header>

                    {/* MAIN */}
                    <main className="relative row-[2_/_3] col-[1_/_2] flex flex-col gap-3">
                        {/* NAV */}
                        <nav className="flex items-start gap-[15px] bg-white p-4 rounded-xl shadow-sm border border-gray-900">
                            <div className="flex flex-wrap gap-[15px] flex-1">
                                {navigationButtons.map((button) => (
                                    <button
                                        key={button.id}
                                        type="button"
                                        className={`${button.bgColor} inline-flex items-center gap-[13px] p-3 rounded-xl text-white ${button.opacity}`}
                                    >
                                        {button.icon}
                                        <span>{button.label}</span>
                                    </button>
                                ))}
                                <div className="flex flex-1 justify-end">
                                    <Link
                                        as="button"
                                        method="post"
                                        href="/logout"
                                        className="bg-red-600 inline-flex items-center gap-[13px] p-3 rounded-xl text-white opacity-75"
                                    >
                                        <LogOut className="w-[23px] h-[21px]" />
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        </nav>

                        {/* CONTENT */}
                        <div className="flex flex-col lg:flex-row gap-5 w-full">
                            {/* ASIDE */}
                            <aside className="flex flex-col w-full lg:w-[403px] gap-[17px] p-5 bg-white rounded-xl border border-black shadow-sm">
                                <div>
                                    <h2 className="text-xl">Gambar Profil</h2>
                                    <hr className="mt-1 border-black" />
                                </div>

                                <div
                                    className="w-[177px] h-[177px] rounded-full bg-[#3a2323] border border-black bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${profileImage})`,
                                    }}
                                />

                                <div className="flex flex-col gap-[5px] bg-red-100 p-3.5 rounded-xl border border-red-400">
                                    <div className="flex items-center gap-[5px]">
                                        <AlertCircle className="w-[15px] text-red-500" />
                                        <p className="text-red-800 font-medium">
                                            Perhatian!
                                        </p>
                                    </div>
                                    <p className="text-red-700 text-[13px]">
                                        Max 1MB, 500x500px. Format: png, jpeg,
                                        jpg, gif.
                                    </p>
                                </div>

                                {errors.foto && (
                                    <p className="text-sm text-red-500">
                                        {errors.foto}
                                    </p>
                                )}

                                <div className="flex gap-[15px] w-full">
                                    <label className="flex flex-1 items-center justify-center gap-2.5 p-3 bg-blue-600 text-white rounded-xl cursor-pointer">
                                        <input
                                            type="file"
                                            accept=".png,.jpeg,.jpg,.gif"
                                            onChange={handleProfileImageUpload}
                                            className="sr-only"
                                        />
                                        <UploadCloud className="w-[18px]" />
                                        Upload
                                    </label>

                                    <button
                                        type="button"
                                        onClick={openDeletePhotoModal}
                                        className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center"
                                    >
                                        <Trash2 className="w-[17px]" />
                                    </button>
                                </div>
                            </aside>

                            {/* FORM */}
                            <section className="flex-1 flex flex-col gap-[15px] p-5 bg-white rounded-xl border border-black shadow-sm">
                                <div>
                                    <h2 className="text-xl">Akun</h2>
                                    <hr className="mt-1 border-black" />
                                </div>

                                <form
                                    onSubmit={handleSaveChanges}
                                    className="flex flex-col gap-[15px]"
                                >
                                    {/* USERNAME */}
                                    <div className="flex flex-col gap-[3px]">
                                        <label className="text-xs">
                                            Nama pengguna
                                        </label>
                                        <div className="flex items-center gap-[13px] p-3 bg-white rounded-xl border border-black">
                                            <User className="w-4 opacity-45" />
                                            <input
                                                disabled
                                                value={data.username}
                                                className="flex-1 bg-transparent outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* PASSWORD LAMA */}
                                    <div className="flex flex-col gap-[3px]">
                                        <label className="text-xs">
                                            Password lama
                                        </label>
                                        <div className="flex items-center p-3 bg-white rounded-xl border border-black">
                                            <Lock className="w-[19px]" />
                                            <input
                                                type="password"
                                                value={data.old_password}
                                                onChange={(e) =>
                                                    setData(
                                                        "old_password",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan password lama"
                                                className="flex-1 bg-transparent outline-none ml-2"
                                            />
                                        </div>
                                    </div>

                                    {/* PASSWORD BARU */}
                                    <div className="flex flex-col md:flex-row gap-[15px]">
                                        <div className="flex flex-col gap-[3px] w-full">
                                            <label className="text-xs">
                                                Password baru
                                            </label>
                                            <div className="flex items-center p-3 bg-white rounded-xl border border-black">
                                                <Lock className="w-5" />
                                                <input
                                                    type="password"
                                                    value={data.new_password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "new_password",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Password baru"
                                                    className="flex-1 bg-transparent outline-none ml-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-[3px] w-full">
                                            <label className="text-xs">
                                                Konfirmasi password baru
                                            </label>
                                            <div className="flex items-center p-3 bg-white rounded-xl border border-black">
                                                <Lock className="w-5" />
                                                <input
                                                    type="password"
                                                    value={
                                                        data.new_password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "new_password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Konfirmasi password"
                                                    className="flex-1 bg-transparent outline-none ml-2"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SAVE */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-[223px] bg-blue-600 text-white flex items-center gap-[13px] p-3 rounded-xl border border-black"
                                    >
                                        <Save className="w-[17px]" />
                                        {processing ? "Menyimpan..." : "Simpan"}
                                    </button>

                                    <a
                                        href="#contact-admin"
                                        className="underline text-xs"
                                    >
                                        Ada masalah? hubungi admin
                                    </a>
                                </form>
                            </section>
                        </div>
                    </main>

                    {/* FOOTER */}
                    <footer className="bg-white p-4 rounded-xl shadow-sm border border-black">
                        <p className="text-gray-500">
                            Copyright Porem ipsum dolor sit
                        </p>
                    </footer>
                </div>
            </div>

            {/* ============================
                MODAL DELETE FOTO PROFIL
            ============================ */}
            <Modals
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeletePhoto}
                variant="delete"
                title="Hapus Foto Profil"
                message="Apakah Anda yakin ingin menghapus foto profil Anda?"
                confirmText="Hapus"
            />
        </div>
    );
}
