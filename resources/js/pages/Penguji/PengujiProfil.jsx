import React, { useState, useEffect } from "react";
// Import hook Inertia
import { useForm, usePage, Link, router } from "@inertiajs/react";
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
    Image,
} from "lucide-react";

// Import Komponen Custom Sesuai Desain
import SidebarPenguji from "../../components/SidebarPenguji.jsx";
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons.jsx";
import OsButton from "../../components/button.jsx";
import Sidebar from "../../components/Sidebar.jsx";

// ⭐ UPDATE 1: CustomInput Handle Disabled State (Background Gray)
const CustomInput = ({
    label,
    type = "text",
    value,
    onChange,
    disabled,
    placeholder,
    icon,
    iconRight,
    error,
}) => (
    <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
        <label className="relative self-stretch mt-[-1.00px] font-sans font-normal text-black text-xs tracking-[0] leading-[normal]">
            {label}
        </label>
        {/* Logika background color */}
        <div
            className={`flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full
            rounded-xl border border-solid border-black ${
                disabled ? "bg-gray-200" : "bg-white"
            }`}
        >
            {icon && (
                <div className="!relative !w-5 !h-5 !aspect-[1] flex items-center justify-center opacity-45">
                    {icon}
                </div>
            )}

            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                // Logika text color & cursor
                className={`relative flex-1 font-sans font-normal text-[15.4px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-full placeholder:text-gray-400 ${
                    disabled ? "text-gray-600 cursor-not-allowed" : "text-black"
                }`}
            />

            {iconRight && (
                <div className="!relative !w-5 !h-5 !aspect-[1] flex items-center justify-center cursor-pointer">
                    {iconRight}
                </div>
            )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);

export default function PengujiProfil() {
    const { user, errors } = usePage().props;

    // ⭐ UPDATE 2: State Password Lengkap
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileImage, setProfileImage] = useState(
        "https://via.placeholder.com/177?text=U"
    );

    const { data, setData, post, processing, reset } = useForm({
        username: user.username || "",
        nama: user.penguji?.nama || "",
        nip: user.penguji?.nip || "",
        foto: null,
        delete_foto: false,
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const getOrangeAvatar = (name) => {
        // background=EA580C (Orange-600 Tailwind)
        // color=fff (Putih)
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
        )}&background=EA580C&color=fff&bold=true&size=177`;
    };

    // ⭐ UPDATE 1: Init Foto Profil dengan Warna Orange
    useEffect(() => {
        if (user.path_gambar) {
            setProfileImage(`/${user.path_gambar}`);
        } else {
            // Gunakan Nama Penguji atau Username sebagai basis inisial
            const displayName =
                user.penguji?.nama || user.username || "Penguji";
            setProfileImage(getOrangeAvatar(displayName));
        }
    }, [user.path_gambar, user.penguji, user.username]);

    const handleProfileImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setData((prev) => ({ ...prev, foto: file, delete_foto: false }));
            setProfileImage(URL.createObjectURL(file));
        }
    };

    // ⭐ UPDATE 2: Reset Foto ke Avatar Orange saat dihapus
    const handleDeleteProfileImage = () => {
        setData((prev) => ({ ...prev, foto: null, delete_foto: true }));

        const displayName = user.penguji?.nama || user.username || "Penguji";
        setProfileImage(getOrangeAvatar(displayName));
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        post("/penguji/pengaturan-akun", {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    "old_password",
                    "new_password",
                    "new_password_confirmation"
                );
            },
        });
    };

    const handleLogout = () => {
        router.post("/logout");
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="relative bg-orange-50 w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                type="penguji"
                onToggle={handleSidebarToggle}
                user={user}
            />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                <OsHeader onMenuClick={handleSidebarToggle} variant="penguji" />

                {/* MAIN CONTENT WRAPPER */}
                <div className=" w-full min-h-screen flex justify-center p-0 font-sans transition-all duration-300">
                    <div className="grid w-full p-os-8 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-14">
                        {/* KONTEN UTAMA (DUA KOLOM) */}
                        <main className="flex flex-col gap-5 w-full">
                            <div className="flex flex-col lg:flex-row items-start gap-5 relative w-full">
                                {/* --- KOLOM KIRI: FOTO PROFIL --- */}
                                <aside className="flex flex-col w-full lg:w-[403px] items-center gap-[17px] p-5 bg-white rounded-xl border border-os-primary-pj shadow-sm">
                                    <div className="w-full">
                                        <div className="flex gap-1 items-center justify-start">
                                            <Image size={18} />
                                            <h2 className="font-semibold text-lg">
                                                Gambar Profil
                                            </h2>
                                        </div>
                                        <hr className="mt-1 border-os-primary-pj" />
                                    </div>

                                    {/* Lingkaran Foto */}
                                    <div
                                        className="w-[177px] h-[177px] rounded-full bg-[#3a2323] border border-black bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${profileImage})`,
                                        }}
                                    />

                                    {/* Alert Box */}
                                    <div className="flex-col items-start gap-[5px] p-3.5 relative self-stretch flex w-full bg-red-100 rounded-xl overflow-hidden border border-solid border-red-400">
                                        <div className="inline-flex items-center gap-[5px]">
                                            <AlertCircle className="w-[15px] text-red-500" />
                                            <div className="font-sans font-medium text-red-800 text-[15px]">
                                                Perhatian!
                                            </div>
                                        </div>
                                        <p className="font-sans font-normal text-red-700 text-[13px]">
                                            Gambar harus berukuran kurang dari 1
                                            MB, resolusi max 500x500 px. Format:
                                            .png, .jpeg, .jpg, .gif
                                        </p>
                                    </div>
                                    {errors.foto && (
                                        <p className="text-sm text-red-500">
                                            {errors.foto}
                                        </p>
                                    )}

                                    {/* Tombol Upload & Delete */}
                                    <div className="flex items-center gap-[15px] relative self-stretch w-full">
                                        <label className="flex items-center justify-center gap-2.5 px-3 py-3 relative flex-1 bg-os-primary-pj text-white rounded-xl cursor-pointer hover:bg-blue-700 transition">
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.gif"
                                                onChange={
                                                    handleProfileImageUpload
                                                }
                                                className="sr-only"
                                            />
                                            <UploadCloud className="w-[18px]" />
                                            <span className="font-sans font-normal text-[15px]">
                                                Upload
                                            </span>
                                        </label>
                                        <OsButton
                                            name="warning"
                                            type="button"
                                            onClick={handleDeleteProfileImage}
                                            className=" bg-red-600 text-white rounded-xl flex items-center justify-center"
                                        >
                                            <Trash2 size={18} />
                                        </OsButton>
                                    </div>
                                </aside>

                                {/* --- KOLOM KANAN: FORM DATA --- */}
                                <section className="flex flex-col items-start gap-[15px] p-5 relative w-full lg:flex-1 bg-white rounded-xl border border-os-primary-pj shadow-sm">
                                    <div className="w-full">
                                        <div className="flex gap-1 items-center justify-start">
                                            <User size={18} />
                                            <h2 className="font-semibold text-lg">
                                                Akun
                                            </h2>
                                        </div>

                                        <hr className="mt-1 border-os-primary-pj" />
                                    </div>

                                    <form
                                        onSubmit={handleSaveChanges}
                                        className="flex flex-col items-start gap-[15px] w-full"
                                    >
                                        {/* USERNAME (Read Only) */}
                                        <CustomInput
                                            label="Nama pengguna"
                                            value={data.username}
                                            disabled // Otomatis Gray Background
                                            icon={
                                                <OsIcon
                                                    name="User"
                                                    className="w-4 h-4 opacity-50"
                                                />
                                            }
                                        />

                                        {/* NAMA LENGKAP (Read Only) */}
                                        <CustomInput
                                            label="Nama Lengkap"
                                            value={data.nama}
                                            disabled
                                        />

                                        {/* NIP (Read Only) */}
                                        <CustomInput
                                            label="NIP / NIDN"
                                            value={data.nip}
                                            disabled
                                            icon={
                                                <OsIcon
                                                    name="Book"
                                                    className="w-4 h-4 opacity-50"
                                                />
                                            }
                                        />

                                        <hr className="w-full border-os-primary-pj my-2" />

                                        {/* ⭐ UPDATE 3: PASSWORD SECTION */}

                                        {/* PASSWORD LAMA */}
                                        <div className="flex flex-col gap-[3px] w-full">
                                            <label className="text-xs">
                                                Password lama
                                            </label>
                                            <div className="flex items-center p-2 bg-white rounded-xl border border-black pr-2">
                                                <Lock
                                                    size={16}
                                                    opacity={0.5}
                                                    className="ml-2"
                                                />
                                                <input
                                                    type={
                                                        showOldPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={data.old_password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "old_password",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Masukkan password lama..."
                                                    className="flex-1 bg-transparent outline-none ml-3 py-1 placeholder:text-gray-400"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowOldPassword(
                                                            !showOldPassword
                                                        )
                                                    }
                                                    className="bg-gray-500 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                                                    title={
                                                        showOldPassword
                                                            ? "Sembunyikan"
                                                            : "Lihat"
                                                    }
                                                >
                                                    {showOldPassword ? (
                                                        <EyeOff size={18} />
                                                    ) : (
                                                        <Eye size={18} />
                                                    )}
                                                </button>
                                            </div>
                                            {errors.old_password && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.old_password}
                                                </p>
                                            )}
                                        </div>

                                        {/* WRAPPER: PASSWORD BARU & KONFIRMASI (SEJAJAR) */}
                                        <div className="flex flex-col md:flex-row gap-[15px] w-full">
                                            {/* PASSWORD BARU */}
                                            <div className="flex flex-col gap-[3px] w-full">
                                                <label className="text-xs">
                                                    Password baru
                                                </label>
                                                <div className="flex items-center p-2 bg-white rounded-xl border border-black pr-2">
                                                    <Lock
                                                        size={16}
                                                        opacity={0.5}
                                                        className="ml-2"
                                                    />
                                                    <input
                                                        type={
                                                            showNewPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={
                                                            data.new_password
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "new_password",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Password baru..."
                                                        className="flex-1 bg-transparent outline-none ml-3 py-1 placeholder:text-gray-400"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowNewPassword(
                                                                !showNewPassword
                                                            )
                                                        }
                                                        className="bg-gray-500 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                                                        title={
                                                            showNewPassword
                                                                ? "Sembunyikan"
                                                                : "Lihat"
                                                        }
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.new_password && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.new_password}
                                                    </p>
                                                )}
                                            </div>

                                            {/* KONFIRMASI PASSWORD */}
                                            <div className="flex flex-col gap-[3px] w-full">
                                                <label className="text-xs">
                                                    Konfirmasi password baru
                                                </label>
                                                <div className="flex items-center p-2 bg-white rounded-xl border border-black pr-2">
                                                    <Lock
                                                        size={16}
                                                        opacity={0.5}
                                                        className="ml-2"
                                                    />
                                                    <input
                                                        type={
                                                            showConfirmPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={
                                                            data.new_password_confirmation
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "new_password_confirmation",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Konfirmasi password..."
                                                        className="flex-1 bg-transparent outline-none ml-3 py-1 placeholder:text-gray-400"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword
                                                            )
                                                        }
                                                        className="bg-gray-500 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                                                        title={
                                                            showConfirmPassword
                                                                ? "Sembunyikan"
                                                                : "Lihat"
                                                        }
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.new_password_confirmation && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {
                                                            errors.new_password_confirmation
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* BUTTONS */}
                                        <div className="w-full flex justify-between gap-3 mt-2">
                                            <OsButton
                                                name="primary-pj"
                                                className="w-[223px] flex items-center justify-start gap-[13px] border border-black"
                                                onClick={handleSaveChanges}
                                                disabled={processing}
                                            >
                                                <Save className="w-[17px]" />
                                                <span>
                                                    {processing
                                                        ? "Menyimpan..."
                                                        : "Simpan"}
                                                </span>
                                            </OsButton>

                                            <OsButton
                                                name="warning"
                                                className="w-[223px] !bg-white !text-red-600 !border-red-600  flex items-center justify-start gap-[13px] !border-os-2"
                                                onClick={handleLogout}
                                                type="button"
                                            >
                                                <LogOut size={17} />
                                                <span>Logout</span>
                                            </OsButton>
                                        </div>

                                        <a
                                            href="#"
                                            className="text-xs underline text-os-primary"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            Ada masalah? hubungi admin
                                        </a>
                                    </form>
                                </section>
                            </div>
                        </main>

                        {/* FOOTER */}
                        <OsCopyright variant="penguji" />
                    </div>
                </div>
            </main>
        </div>
    );
}
