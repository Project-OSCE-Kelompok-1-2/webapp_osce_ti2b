import React, { useState, useEffect } from "react";
// Import hook Inertia
import { useForm, usePage, router, Head } from "@inertiajs/react";
// Catatan: 'Home' dihapus dari import karena sudah ditangani di dalam OsHeader (atau tidak dipakai jika mode goback)
import {
    AlertCircle,
    Eye,
    EyeOff,
    LogOut,
    Save,
    Trash2,
    UploadCloud,
    Lock,
} from "lucide-react";

// Import Komponen Custom Sesuai Desain
import OsHeader from "../../components/Header.jsx";
import OsCopyright from "../../components/Copyright.jsx";
import OsIcon from "../../components/icons.jsx";
import OsButton from "../../components/button.jsx";
import Sidebar from "../../components/Sidebar.jsx";

// Komponen Input Custom (Sesuai Desain)
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
    <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto] ">
        <label className="relative self-stretch mt-[-1.00px] font-sans font-normal text-black text-xs tracking-[0] leading-[normal]">
            {label}
        </label>
        <div
            className={`flex h-[54px] items-center gap-[13px] p-3 relative self-stretch w-full
            rounded-xl border border-solid border-black`}
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
                className="relative flex-1 font-sans font-normal text-black text-[15.4px] tracking-[0] leading-[normal] bg-transparent border-none outline-none w-full placeholder:text-gray-400"
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

export default function MahasiswaAccountSettings() {
    // 1. AMBIL DATA DARI PROPS (Backend Asdif)
    const { user, errors, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false); // Tambahan state untuk new password toggle

    // State untuk preview gambar
    const [profileImage, setProfileImage] = useState(
        "https://via.placeholder.com/177?text=U"
    );

    // 2. INISIALISASI FORM
    const { data, setData, post, processing, reset } = useForm({
        // Data Tampilan (Read Only)
        username: user.username || "",
        nama: user.mahasiswa?.nama || "",
        nim: user.mahasiswa?.nim || "",

        // Data Inputan
        foto: null,
        delete_foto: false,
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    // 3. EFFECT: SET PREVIEW GAMBAR
    useEffect(() => {
        if (user.path_gambar) {
            setProfileImage(`/${user.path_gambar}`);
        } else {
            setProfileImage("https://via.placeholder.com/177?text=U");
        }
    }, [user.path_gambar]);

    // 4. HANDLERS
    const handleProfileImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setData({
                ...data,
                foto: file,
                delete_foto: false,
            });
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleDeleteProfileImage = () => {
        setData({
            ...data,
            foto: null,
            delete_foto: true,
        });
        setProfileImage("https://via.placeholder.com/177?text=U");
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        post("/mahasiswa/pengaturan-akun", {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset(
                    "old_password",
                    "new_password",
                    "new_password_confirmation",
                    "foto"
                );
            },
        });
    };

    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="relative bg-os-white w-full min-h-screen flex justify-start p-os-12 font-sans overflow-hidden">
            <Head title="Pengaturan Akun" />

            {/* SIDEBAR */}
            <Sidebar
                type="mahasiswa"
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <main className="grid w-full p-os-16 lg:p-4 h-fit grid-cols-1 grid-rows-[auto_1fr_auto] gap-os-8 transition-all duration-300 lg:ml-20">
                {/* --- IMPLEMENTASI OS HEADER --- */}
                <OsHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* KONTEN UTAMA (DUA KOLOM) */}
                <div className="flex flex-col gap-5 w-full">
                    {/* FLASH MESSAGE */}
                    {flash?.success && (
                        <div
                            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <strong className="font-bold">Berhasil!</strong>
                            <span className="block sm:inline">
                                {" "}
                                {flash.success}
                            </span>
                        </div>
                    )}
                    {flash?.error && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline">
                                {" "}
                                {flash.error}
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row items-start gap-5 relative w-full">
                        {/* --- KOLOM KIRI: FOTO PROFIL --- */}
                        <aside className="flex flex-col w-full lg:w-[403px] items-center gap-[17px] p-5  rounded-xl border border-os-primary shadow-sm">
                            <div className="relative self-stretch w-full h-[29px]">
                                <h2 className="text-xl">Gambar Profil</h2>
                                <hr className="mt-1 border-os-primary" />
                            </div>

                            {/* Lingkaran Foto */}

                            <div
                                className="w-[177px] h-[177px] rounded-full bg-[#3a2323] border border-black bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${profileImage})`,
                                }}
                            />

                            {/* Alert Box */}
                            <div className="flex flex-col gap-[5px] bg-red-100 p-3 rounded-xl border border-red-400 w-full">
                                <div className="flex items-center gap-[5px]">
                                    <AlertCircle className="w-[15px] text-red-500" />
                                    <p className="text-red-800 font-medium">
                                        Perhatian!
                                    </p>
                                </div>
                                <p className="text-red-700 text-[13px]">
                                    Max 1MB, 500x500px. Format: png, jpeg, jpg,
                                    gif.
                                </p>
                            </div>
                            {errors.foto && (
                                <p className="text-sm text-red-500">
                                    {errors.foto}
                                </p>
                            )}

                            {/* Tombol Upload & Delete */}
                            <div className="flex items-center gap-[15px] relative self-stretch w-full">
                                <label className="flex items-center justify-center gap-2.5 px-3 py-3 relative flex-1 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-600 transition">
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.gif"
                                        onChange={handleProfileImageUpload}
                                        className="sr-only"
                                    />
                                    <UploadCloud className="w-[18px]" />
                                    <span className="font-sans font-normal text-[15px] ">
                                        Upload
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={handleDeleteProfileImage}
                                    className="flex w-12 h-12 items-center justify-center bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                                >
                                    <Trash2 className="w-[20px]" />
                                </button>
                            </div>
                        </aside>

                        {/* --- KOLOM KANAN: FORM DATA --- */}
                        <section className="flex flex-col items-start gap-[15px] p-5 relative flex-1 grow  rounded-xl border border-os-primary shadow-sm">
                            <div className="relative self-stretch w-full h-[29px]">
                                <h2 className="absolute top-[calc(50%_-_14px)] left-0 font-sans font-normal text-black text-xl">
                                    Akun
                                </h2>
                                <hr className="absolute top-7 left-0 w-full border-os-primary border-t" />
                            </div>

                            <form
                                onSubmit={handleSaveChanges}
                                className="flex flex-col items-start gap-[15px] w-full"
                            >
                                {/* USERNAME (Read Only) */}
                                <CustomInput
                                    label="Nama pengguna"
                                    value={data.username}
                                    disabled
                                    icon={
                                        <OsIcon
                                            name="User"
                                            className="w-4 h-4"
                                        />
                                    }
                                />

                                {/* NAMA LENGKAP (Read Only) */}
                                <CustomInput
                                    label="Nama Lengkap"
                                    value={data.nama}
                                    disabled
                                />

                                {/* NIM (Read Only) */}
                                <CustomInput
                                    label="NIM"
                                    value={data.nim}
                                    icon={
                                        <OsIcon
                                            name="Book"
                                            className="w-5 h-5"
                                        />
                                    }
                                    disabled
                                />

                                <hr className="w-full border-os-primary my-2" />

                                {/* PASSWORD INPUTS */}
                                <CustomInput
                                    type={showOldPassword ? "text" : "password"}
                                    label="Password lama"
                                    placeholder="Masukkan password lama..."
                                    value={data.old_password}
                                    onChange={(e) =>
                                        setData("old_password", e.target.value)
                                    }
                                    error={errors.old_password}
                                    icon={<Lock size={16} opacity={0.5} />}
                                    iconRight={
                                        <div
                                            onClick={() =>
                                                setShowOldPassword(
                                                    !showOldPassword
                                                )
                                            }
                                        >
                                            {showOldPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </div>
                                    }
                                />

                                <div className="flex flex-col lg:flex-row gap-5 w-full">
                                    <div className="flex-1">
                                        <CustomInput
                                            type={
                                                showNewPass
                                                    ? "text"
                                                    : "password"
                                            }
                                            label="Password baru"
                                            placeholder="Masukkan password baru..."
                                            value={data.new_password}
                                            onChange={(e) =>
                                                setData(
                                                    "new_password",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.new_password}
                                            icon={
                                                <Lock size={16} opacity={0.5} />
                                            }
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <CustomInput
                                            type={
                                                showNewPass
                                                    ? "text"
                                                    : "password"
                                            }
                                            label="Konfirmasi password baru"
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
                                            icon={
                                                <Lock size={16} opacity={0.5} />
                                            }
                                            iconRight={
                                                <div
                                                    onClick={() =>
                                                        setShowNewPass(
                                                            !showNewPass
                                                        )
                                                    }
                                                >
                                                    {showNewPass ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </div>
                                            }
                                        />
                                    </div>
                                </div>

                                {/* BUTTONS GROUP */}
                                <div className="w-full flex justify-between gap-3 mt-2">
                                    <OsButton
                                        name="primary"
                                        className="w-[223px] flex items-center rounded-xl p-3 justify-start gap-[13px] border border-black bg-[#0B0931] text-blue-100"
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

                                    {/* <OsButton
                                        name="warning"
                                        className="w-[223px] flex items-center rounded-xl p-3 justify-center gap-[13px] border border-black bg-red-600"
                                        onClick={handleLogout}
                                        type="button"
                                    >
                                        <LogOut className="w-[23px] h-[21px]" />
                                        <span>Logout</span>
                                    </OsButton> */}
                                    <OsButton
                                        name="warning"
                                        className="sm:w-[223px] w-6/12 !bg-white !text-red-600 !border-red-600  flex items-center justify-start gap-[13px] !border-os-2"
                                        onClick={() => {
                                            console.log("dsajdsaldka");
                                            handleLogout();
                                        }}
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
                </div>

                {/* FOOTER */}
                <div className="mt-2">
                    <OsCopyright />
                </div>
            </main>
        </div>
    );
}
